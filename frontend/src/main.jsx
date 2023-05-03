import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { Login } from "./pages/Login/Login";
import LandingPage2 from "./pages/LandingPage2/LandingPage2";
import Join from "./pages/Join/Join";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage2 />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/join",
    element: <Join />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
