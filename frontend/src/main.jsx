import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App.jsx";
import { DataProvider } from "./context/DataContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </StrictMode>
);