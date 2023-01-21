import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { API_ENDPOINT, DEFAULT_PAGE_SIZE } from '../constants';
import { history, fetchWrapper } from '../helpers';

const name = 'quiz';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

function createInitialState() {
  return {
    // initialize state from local storage to enable user to stay logged in
    list: [],
    totalCount: 0,
    public: null,
    loading: false,
    selected: null,
    done: false,
    result: '',
    error: null,
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

function createReducers() {
  return {};
}

function createExtraActions() {
  const baseUrl = `${API_ENDPOINT}/quizzes`;

  return {
    getList: getList(),
    create: create(),
    update: update(),
    remove: remove(),
    getById: getById(),
    publish: publish(),
    getByPermalink: getByPermalink(),
    startQuiz: startQuiz(),
    submitResult: submitResult(),
  };

  function getList() {
    return createAsyncThunk(
      `${name}/`,
      async ({ page, pageSize }) =>
        await fetchWrapper.get(`${baseUrl}?page=${page}&limit=${pageSize}`),
    );
  }

  function create() {
    return createAsyncThunk(
      `${name}/create`,
      async (data) => await fetchWrapper.post(`${baseUrl}`, data),
    );
  }

  function update() {
    return createAsyncThunk(
      `${name}/update`,
      async (data) => await fetchWrapper.put(`${baseUrl}/${data._id}`, data),
    );
  }

  function remove() {
    return createAsyncThunk(
      `${name}/remove`,
      async (id) => await fetchWrapper.delete(`${baseUrl}/${id}`),
    );
  }

  function getById() {
    return createAsyncThunk(
      `${name}/getById`,
      async (id) => await fetchWrapper.get(`${baseUrl}/${id}`),
    );
  }

  function publish() {
    return createAsyncThunk(
      `${name}/publish`,
      async (id) => await fetchWrapper.post(`${baseUrl}/${id}/publish`),
    );
  }

  function getByPermalink() {
    return createAsyncThunk(
      `${name}/getByPermalink`,
      async (pId) => await fetchWrapper.get(`${baseUrl}/publish/${pId}`),
    );
  }

  function startQuiz() {
    return createAsyncThunk(
      `${name}/startQuiz`,
      async (pId) => await fetchWrapper.post(`${baseUrl}/publish/${pId}/start`),
    );
  }

  function submitResult() {
    return createAsyncThunk(
      `${name}/submitResult`,
      async ({ pId, data }) => await fetchWrapper.post(`${baseUrl}/publish/${pId}/result`, data),
    );
  }
}

function createExtraReducers() {
  return {
    ...getList(),
    ...create(),
    ...update(),
    ...remove(),
    ...getById(),
    ...publish(),
    ...getByPermalink(),
    ...startQuiz(),
    ...submitResult(),
  };

  function getList() {
    let { pending, fulfilled, rejected } = extraActions.getList;
    return {
      [pending]: (state) => {
        state.loading = true;
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const { data, totalCount } = action.payload;
        const { arg } = action.meta;
        state.list = data;
        state.totalCount = totalCount;
        state.loading = false;
        state.page = arg.page;
        state.pageSize = arg.pageSize;
      },
      [rejected]: (state, action) => {
        state.list = [];
        state.error = action.error;
        state.loading = false;
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
        state.list = [...state.list, data].slice(0, state.pageSize);
        state.totalCount++;
        toast.success('New quiz was added successfully.');
        history.navigate('/');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while creating a quiz.');
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
        toast.success('Quiz was updated successfully.');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while updating a quiz.');
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
        const { arg: id } = action.meta;
        state.list = state.list.filter((item) => item._id !== id);
        state.totalCount--;
        toast.success('Quiz was removed successfully.');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while deleting a quiz.');
      },
    };
  }

  function getById() {
    let { pending, fulfilled, rejected } = extraActions.getById;
    return {
      [pending]: (state) => {
        state.selected = null;
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const { data } = action.payload;
        state.selected = data;
      },
      [rejected]: (state, action) => {
        state.selected = null;
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while getting a quiz.');
        history.navigate('/');
      },
    };
  }

  function publish() {
    let { pending, fulfilled, rejected } = extraActions.publish;
    return {
      [pending]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const { arg: id } = action.meta;
        const { data } = action.payload;
        state.list = state.list.map((item) =>
          item._id === id ? { ...item, published: true, permalinkId: data.permalinkId } : item,
        );
        state.selected = { ...state.selected, published: true };
        toast.success(action.payload.message || 'Quiz was published successfully.');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while publishing this quiz.');
      },
    };
  }

  function getByPermalink() {
    let { pending, fulfilled, rejected } = extraActions.getByPermalink;
    return {
      [pending]: (state) => {
        state.loading = true;
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const { data } = action.payload;
        if (!data.quiz.published) {
          toast.error('This quiz is not published yet.');
          state.public = null;
        } else {
          state.public = data;
        }
        state.loading = false;
      },
      [rejected]: (state, action) => {
        state.loading = false;
        state.error = action.error;
        history.navigate('/not-found');
        toast.error(state.error.message || 'A problem was occurred while getting permalink.');
      },
    };
  }

  function startQuiz() {
    let { pending, fulfilled, rejected } = extraActions.startQuiz;
    return {
      [pending]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const { message } = action.payload;
        state.result = message;
        toast.success('Quiz started.');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while starting quiz.');
      },
    };
  }

  function submitResult() {
    let { pending, fulfilled, rejected } = extraActions.submitResult;
    return {
      [pending]: (state) => {
        state.done = false;
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        state.done = true;
        const { message } = action.payload;
        state.result = message;
        toast.success('Quiz was submitted successfully.');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
        toast.error(state.error.message || 'A problem was occurred while submitting result.');
      },
    };
  }
}

export const quizActions = { ...slice.actions, ...extraActions };
export const quizReducer = slice.reducer;
