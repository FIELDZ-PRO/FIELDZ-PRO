import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//import './index.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const clientId = "655220357439-lrukcts2dnjjvbpk0hdt6j1tsbqe423j.apps.googleusercontent.com";

const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
