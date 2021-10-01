import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './App.css'
import { AuthContextProvider } from "./context/AuthContext";
import {stores, StoresProvider} from './Store/'

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <StoresProvider value={stores}>
        <App />
      </StoresProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
