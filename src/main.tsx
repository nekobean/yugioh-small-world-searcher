import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";

import ReactGA from "react-ga4";

// Google Analytics
ReactGA.initialize("G-GDCFWZN645");
ReactGA.send("pageview");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
