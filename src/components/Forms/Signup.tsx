import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { isPasswordValid } from "../validations/formValidations";

type SignupType = {
  registerUser: (userInfo: { username: string; password: string }) => void;
  isRegister: boolean;
  setIsRegister: (isRegister: boolean) => void;
  error: boolean;
  setError: (error: boolean) => void;
};

const usernameErrorMessage = "Username not found";
const passwordErrorMessage =
  "Password must be over 4 characters and one capital letter";
const confirmPasswordErrorMessage = "Passwords are not the same";

export const Signup = () => {
  const { registerUser, setIsRegister } = useAuth() as SignupType;

  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const usernameValid = usernameInput.length > 2;
  const passwordValid = isPasswordValid(password);
  const confirmPasswordValid = password === confirmPass;

  const showUsernameError = !usernameValid && error;
  const showPasswordError = !passwordValid && error;
  const showConfirmPasswordError = !confirmPasswordValid && error;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // !need to abstract elements
    try {
      registerUser({
        username: usernameInput,
        password: password,
      });

      if (!usernameValid || !passwordValid || !confirmPasswordValid) {
        setIsRegister(false);
        setError(true);
      } else {
        setError(false);
        setIsRegister(true);
        navigate("/lobby");
      }
    } catch (err) {
      toast.error("Signup Error");
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
        <h2>Signup</h2>
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
          {showUsernameError ? (
            <div className="text-red-500">{usernameErrorMessage}</div>
          ) : null}
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
          {showPasswordError ? (
            <div className="text-red-500">{passwordErrorMessage}</div>
          ) : null}
        </div>
        <div className="flex flex-row gap-1">
          <label htmlFor="" className="w-32 text-lg mb-2 p-3">
            Confirm Password:
          </label>
          <input
            type="text"
            className="items-center h-14 w-full max-w-md border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={(e) => setConfirmPass(e.target.value)}
            value={confirmPass}
          />
          {showConfirmPasswordError ? (
            <div className="text-red-500">{confirmPasswordErrorMessage}</div>
          ) : null}
        </div>
        <div className="flex flex-row gap-10 text-center">
          <button
            onClick={() => navigate("/")}
            className="w-32 text-lg mb-2 p-3"
          >
            Back
          </button>
          <input
            type="submit"
            className="items-center h-14 w-full max-w-md border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </form>
  );
};
