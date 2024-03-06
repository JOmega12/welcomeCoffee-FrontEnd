import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {registerFetch } from "../api/UserAPI";
import { UserInformation } from "../types/types";
import { EXPRESS_API_CONFIG } from "../api/config";

type TAuthContext = {
  user: UserInformation | null;
  setUser: Dispatch<SetStateAction<UserInformation | null>>;
  isRegister: boolean;
  registerUser: (user: UserInformation) => Promise<void>;
  loginUser: (
    userInfo: Pick<UserInformation, "password" | "username">
  ) => Promise<UserInformation | undefined>;
  logoutUser: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};


const AuthContext = createContext<TAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserInformation | null>(null);
  const isRegister = !!user;

  const registerUser = async ({ username, password }: UserInformation) => {

    try {
      const { token, userInformation }= await registerFetch({username, password});
      localStorage.setItem("token_auth", token)
      setUser(userInformation);
    } catch(e) {
      console.error("Something Went Wrong")
    }

  };

  
  const loginUser = async ({
    username,
    password,
  }: Pick<UserInformation, "username" | "password">): Promise<
    UserInformation | undefined
  > => {
    try {
      const getToken = (): string | null => {
        // .getItem(key)
        return localStorage.getItem("token_auth")
     };
      if(getToken === null) {
         throw new Error("No token available");
      }
      
      const response =  await fetch(EXPRESS_API_CONFIG.baseUrl + "/auth/login", {
        method: "POST",
        Authorization: `Bearer ${getToken}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password})
      }as RequestInit);

      if(!response.ok) {
        throw new Error("Invalid credentials");
      }

      const { token, userInformation } = await response.json();

      localStorage.setItem("token_auth_coffee", token);

      if (!userInformation.username) {
        throw new Error("User not found");
      }

      //this ONLY adds the SPECIFIC USER when you login
      setUser(userInformation);
      return userInformation;
    } catch (e) {
      console.error("error while logging in");
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token_auth");
    localStorage.removeItem("token_auth_coffee");
  };

  useEffect(() => {
    const maybeUser = localStorage.getItem("token_auth");
    if (maybeUser) {
      try {
        setUser(JSON.parse(maybeUser));
      } catch (err) {
        console.log("Error parsing user data", err);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isRegister,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Please use `useAuth` hook in context of AuthAontext");
  }
  return context;
};