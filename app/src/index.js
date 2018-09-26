import React from 'react';
import ReactDOM from 'react-dom';
import { Router, BrowserRouter } from 'react-router-dom';
import App from './App';
import history from '~/common/history';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <Router history={history}>
      <App />
    </Router>,
    document.getElementById('mount')
  );
});