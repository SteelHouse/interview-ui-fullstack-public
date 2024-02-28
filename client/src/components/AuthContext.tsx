import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// CSW - seems like this needs a way to set logged in on login success...? Trying to add 
// that (I admit I'm leaning on chatGPT for some guidance here; ther AI suggestion needed
// some revision here before I got this working)

const AuthContext = createContext({
  authing: true,
  loggedIn: false, 
  setLoggedInState: (loggedInState: boolean) => {},
  setAuthingState: (loggedInState: boolean) => {} 
});

export const AuthContextProvider: FC<PropsWithChildren<{loggedIn:boolean; authing: boolean}>> = ({children}) => {
  const [authing, setAuthing] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const setLoggedInState = (loggedInState: boolean) => {
    console.log(`setting loggedIn to ${loggedInState}`)
    setLoggedIn(loggedInState);
  };

  const setAuthingState = (authingState: boolean) => {
    console.log(`setting authing to ${authingState}`)
    setAuthing(authingState);
  };

  return (<AuthContext.Provider value={{loggedIn, authing, setLoggedInState, setAuthingState}}>{children}</AuthContext.Provider>);
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};