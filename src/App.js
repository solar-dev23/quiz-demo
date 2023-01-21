import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CustomRouter from './routes';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const theme = createTheme();

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <CustomRouter />
        </BrowserRouter>
      </ThemeProvider>
      <ToastContainer autoClose={3000} hideProgressBar={true} />
    </div>
  );
}

export default App;
