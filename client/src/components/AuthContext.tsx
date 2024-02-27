import { createContext, FC, PropsWithChildren, useContext } from "react";

const AuthContext = createContext({authing: true, loggedIn: false});

export const AuthContextProvider: FC<PropsWithChildren<{loggedIn:boolean; authing: boolean}>> = ({children, authing, loggedIn}) => (
  <AuthContext.Provider value={{loggedIn, authing}}>{children}</AuthContext.Provider>
);

export const useAuthContext = () => {
  return useContext(AuthContext);
};