import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { API_ENDPOINT } from '../constants';
import { history, fetchWrapper } from '../helpers';

const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

function createInitialState() {
  return {
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user')),
    error: null,
  };
}

function createReducers() {
  return {
    logout,
    reset,
  };

  function logout(state) {
    state.user = null;
    localStorage.removeItem('user');
    history.navigate('/signin');
  }

  function reset(state) {
    state.error = null;
  }
}

function createExtraActions() {
  const baseUrl = `${API_ENDPOINT}/auth`;

  return {
    login: login(),
    signup: signup(),
  };

  function login() {
    return createAsyncThunk(
      `${name}/login`,
      async (data) => await fetchWrapper.post(`${baseUrl}/login`, data),
    );
  }

  function signup() {
    return createAsyncThunk(
      `${name}/signup`,
      async (data) => await fetchWrapper.post(`${baseUrl}/signup`, data),
    );
  }
}

function createExtraReducers() {
  return {
    ...login(),
    ...signup(),
  };

  function login() {
    let { pending, fulfilled, rejected } = extraActions.login;
    return {
      [pending]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
        const { data: user } = action.payload;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        state.user = user;

        // get return url from location state or default to home page
        const { from } = history.location.state || { from: { pathname: '/' } };
        history.navigate(from);
      },
      [rejected]: (state, action) => {
        state.error = action.error;
      },
    };
  }

  function signup() {
    let { pending, fulfilled, rejected } = extraActions.signup;
    return {
      [pending]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state) => {
        state.error = null;
        toast.success('New user has been registered successfully.');
        history.navigate('/signin');
      },
      [rejected]: (state, action) => {
        state.error = action.error;
      },
    };
  }
}

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;
