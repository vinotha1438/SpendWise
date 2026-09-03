import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "./i18n";

import App from "./App.jsx";
import { DataProvider } from "./context/DataContext";

import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ThemeProvider>
  </StrictMode>
);

// Register the service worker only in production. In dev, an
// active service worker can interfere with Vite's hot reload, so
// we deliberately skip it while running `npm run dev`.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => {
        console.log("Service worker registration failed:", err);
      });
  });
}