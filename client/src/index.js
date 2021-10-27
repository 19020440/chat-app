import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './App.css'
import { AuthContextProvider } from "./context/AuthContext";
import {stores, StoresProvider} from './Store/'
import { BrowserRouter } from "react-router-dom";
ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <StoresProvider value={stores}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StoresProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
