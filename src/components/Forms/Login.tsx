import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { UserInformation } from "../../types/types";

type LoginTypes = {
  loginUser: (userInfo: { username: string; password: string }) => void;
  setIsRegister: (register: boolean) => void;
  user: UserInformation;
};


// const usernameErrorMessage = 'Username not found';
// const passwordErrorMessage = 'Password not found';
// const loginErrorMessage = 'User is not registered';

export const Login = () => {
  const { loginUser, setIsRegister, user } = useAuth() as LoginTypes;

  // ? I dont know why setIsRegister for
  // !need to do more research
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState(false);
  // const [isSubmit, setIsSubmit] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // !Still need error handling reference signup comp
    // Promise.resolve()
    //   .then(() =>
    //     loginUser({
    //       username: usernameInput,
    //       password: password,
    //     })
    //   )
    //   .then(() => {
    //     setIsRegister(true);
    //     navigate("/lobby");
    //   })
    //   .catch((err) => {
    //     toast.error("Login error");
    //     console.log(err);
    //   });
    try {
      await loginUser({
        username: usernameInput,
        password: password,
      });
      // Only navigate if login is successful
      console.log(user, 'userin login')
      if(usernameInput === user.username && password === user.password) {
        setIsRegister(true);
        navigate("/lobby");
      } else if(usernameInput !== user.username || password!== user.password || usernameInput.length === 0 && password.length === 0) {
        setIsRegister(false);
        toast.error('Login Error');
      }
    } catch (err) {
      toast.error("Login error");
      console.log(err);
    }
  };

  return (
    <form
      className="flex-col items-center"
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div className="text-center text-[#2E1E17] p-5 rounded-xl text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        <h2>Login</h2>
      </div>
      <div className="flex flex-col space-y-4 ">
        <div className="flex flex-row">
          <label htmlFor="" className=" w-32 text-lg mb-2 p-3 ">
            Username:
          </label>
          <input
            type="text"
            className="items-center h-14 w-full max-w-md border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={(e) => setUsernameInput(e.target.value)}
            value={usernameInput}
          />

        </div>
        <div className="flex flex-row">
          <label htmlFor="" className="w-32 text-lg mb-2 p-3">
            Password:
          </label>
          <input
            type="text"
            className="items-center h-14 w-full max-w-md border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="flex flex-row gap-10 text-center">
          <button
            onClick={() => navigate("/")}
            className="items-center h-14 w-full max-w-md border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
          >
            Back
          </button>
          <input
            type="submit"
            className="items-center h-14 w-full max-w-md border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
          />
        </div>
        {/* add back button */}
      </div>
    </form>
  );
};
