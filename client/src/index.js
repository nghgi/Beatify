import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StateProvider } from './Context/StateProvider';

import {BrowserRouter as Router} from 'react-router-dom'
import { initialState } from './Context/intialState';
import reducer from './Context/reducer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </Router>
  </React.StrictMode>
);
