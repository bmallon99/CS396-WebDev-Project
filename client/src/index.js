import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App.js';
import Home from './Home';

ReactDOM.render(
  // <BrowserRouter>
    <React.StrictMode>
      <Home />
    </React.StrictMode>,
  // </BrowserRouter>,
  document.getElementById('root')
);