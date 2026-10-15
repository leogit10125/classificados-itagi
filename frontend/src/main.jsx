import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// CSS Global
import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/animations.css";
import "./styles/utilities.css";

// CSS da aplicação
import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);