import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import API from "./API";
import { BrowserRouter } from 'react-router-dom';

let UniversalService = new API();
UniversalService.CheckAuthorization();
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App service={UniversalService}/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
