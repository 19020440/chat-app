import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './App.css'
import {stores, StoresProvider} from './Store/'
import { BrowserRouter } from "react-router-dom";
import {store, updateFrame, birdjump, game, states, rungame} from './Store/store'
ReactDOM.render(
  <React.StrictMode>
      <StoresProvider value={stores}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StoresProvider>
  </React.StrictMode>,
  document.getElementById("root")
);


