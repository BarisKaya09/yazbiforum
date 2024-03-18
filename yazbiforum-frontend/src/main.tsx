import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App>
    <RouterProvider router={router}></RouterProvider>
  </App>
);
