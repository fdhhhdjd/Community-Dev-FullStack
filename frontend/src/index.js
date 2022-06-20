import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import AppProviders from "./Contexts/index";
import reportWebVitals from "./reportWebVitals";
import "./Styles/Global.css";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProviders>
      <Router>
        <App />
      </Router>
    </AppProviders>
  </React.StrictMode>
);
reportWebVitals();
