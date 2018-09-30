import React from 'react';
import ReactDOM from 'react-dom';
import { Router, BrowserRouter } from 'react-router-dom';
import App from './App';
import history from '~/common/history';
import { CookiesProvider } from 'react-cookie';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <CookiesProvider>
      <Router history={history}>
        <App />
      </Router>
    </CookiesProvider>,
    document.getElementById('mount')
  );
});