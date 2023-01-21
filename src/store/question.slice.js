import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { API_ENDPOINT } from '../constants';
import { fetchWrapper } from '../helpers';

const name = 'question';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

function createInitialState() {
  return {
    // initialize state from local storage to enable user to stay logged in
    list: [],
    error: null,
    selected: {
      id: null,
      editing: false,
      deleting: false,
    },
  };
}

function createReducers() {
  return {
    updateSelected,
  };

  function updateSelected(state, action) {
    state.selected = {
      id: action.payload.id,
      editing: action.payload.editing,
      deleting: action.payload.deleting,
    };
  }
}

function createExtraActions() {
  const baseUrl = `${API_ENDPOINT}/quizzes`;

  return {
    getList: getList(),
    create: create(),
    update: update(),
    remove: remove(),
    reorder: reorder(),
  };

  function getList() {
    return createAsyncThunk(
      `${name}/`,
      async (qzId) => await fetchWrapper.get(`${baseUrl}/${qzId}/questions`),
    );
  }

  function create() {
    return createAsyncThunk(
      `${name}/create`,
      async ({ qzId, data }) => await fetchWrapper.post(`${baseUrl}/${qzId}/questions`, data),
    );
  }

  function update() {
    return createAsyncThunk(
      `${name}/update`,
      async ({ qzId, data }) =>
        await fetchWrapper.put(`${baseUrl}/${qzId}/questions/${data._id}`, data),
    );
  }

  function remove() {
    return createAsyncThunk(
      `${name}/remove`,
      async ({ qzId, qsId }) => await fetchWrapper.delete(`${baseUrl}/${qzId}/questions/${qsId}`),
    );
  }

  function reorder() {
    return createAsyncThunk(
      `${name}/reorder`,
      async ({ qzId, data }) =>
        await fetchWrapper.post(`${baseUrl}/${qzId}/questions/reorder`, data),
    );
  }
}

function createExtraReducers() {
  return {
    ...getList(),
    ...create(),
    ...update(),
    ...remove(),
    ...reorder(),
  };

  function getList() {
    let { pending, fulfilled, rejected } = extraActions.getList;
    return {
      [pending]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const { data } = action.payload;
        state.list = data;
      },
      [rejected]: (state, action) => {
        state.error = action.error;
      },
    };
  }

  function create() {
    let { pending, fulfilled, rejected } = extraActions.create;
    return {
      [pending]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const { data } = action.payload;
        state.list = [...state.list, data];
        toast.success('New question was added successfully.');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while creating a question.');
      },
    };
  }

  function update() {
    let { pending, fulfilled, rejected } = extraActions.update;
    return {
      [pending]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const { data } = action.payload;
        state.list = state.list.map((item) => (item._id === data._id ? data : item));
        toast.success('Question was updated successfully.');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while updating a question.');
      },
    };
  }

  function remove() {
    let { pending, fulfilled, rejected } = extraActions.remove;
    return {
      [pending]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const { arg } = action.meta;
        state.list = state.list.filter((item) => item._id !== arg.qsId);
        toast.success('Question was removed successfully.');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while deleting a question.');
      },
    };
  }

  function reorder() {
    let { pending, fulfilled, rejected } = extraActions.reorder;
    return {
      [pending]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        state.error = null;
        toast.success('Questions was reordered successfully.');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while reordering questions.');
      },
    };
  }
}

export const questionActions = { ...slice.actions, ...extraActions };
export const questionReducer = slice.reducer;
