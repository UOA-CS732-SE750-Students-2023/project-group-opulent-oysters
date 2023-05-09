import React from "react";
import { useState } from "react";
import useLocalStorage from "./util/useLocalStorage";

export const AppContext = React.createContext({});

export function AppContextProvider({ children }) {
  // Hold the user token in local storage
  const [token, setToken] = useLocalStorage("token", []);

  const context = {
    token,
    setToken,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
