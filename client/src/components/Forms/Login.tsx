import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { TextInputs } from "./TextInputs";
import CoffeeLoginImage from "../../images/CoffeeLoginImage.jpg";

const usernameErrorMessage = "Username not found";
const passwordErrorMessage = "Password not found";
const loginErrorMessage = "User is not registered";

export const Login = () => {
  const { loginUser, user } = useAuth();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const usernameValid = usernameInput === user?.username;
  const passwordValid = passwordInput === user?.password;
  const loginValid = usernameValid && passwordValid;

  const showUsernameError = !usernameValid && error;
  const showPasswordError = !passwordValid && error;
  const showLoginError = !loginValid && error;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    loginUser({
      password: passwordInput,
      username: usernameInput,
    })
      .then((user) => {
        if (!user) {
          setError(true);
          return;
        } else {
          // it used to be "user for setItem"
          localStorage.setItem("token_auth", JSON.stringify(user));
          setError(false);
          toast.success("Login complete");
          navigate("/coffee");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setLoading(false));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if(e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      className="flex flex-col min-[320px]:h-screen"
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      onKeyDown={(e) => {
        handleKeyDown(e)
      }}
    >
      <div className="flex max-[765px]:flex-col  lg:flex-row gap-10 items-center">
        <div className="w-[320px] h-full max-[765px]:hidden">
          <img src={CoffeeLoginImage} alt="Coffee Login Image" />
        </div>
        
        <div className="">
          <div className="flex flex-row items-center text-center text-[#2E1E17] p-5 rounded-xl text-3xl md:text-4xl lg:text-5xl font-bold mb-4 gap-2 justify-between">
            <button
              onClick={() => navigate("/multi-login")}
              className="text-base w-[100px] border border-gray-300 rounded-lg py-2 px-3 focus:outline-none bg-blue-500 focus:border-blue-500 text-white hover:bg-blue-700"
              // style={{ alignSelf: "flex-start" }}
            >
              Back
            </button>
            <h2 className="flex-grow text-center max-[765px]:text-3xl">Login</h2>
          </div>

          <div className="flex flex-col space-y-4 px-2">
            <TextInputs
              label="Username:"
              onChange={(e) => setUsernameInput(e.target.value)}
              value={usernameInput}
              show={showUsernameError}
              message={usernameErrorMessage}
            />
            <TextInputs
              type="password"
              label="Password:"
              onChange={(e) => setPassword(e.target.value)}
              value={passwordInput}
              show={showPasswordError}
              message={passwordErrorMessage}
            />
            {showLoginError ? (
              <div className="text-red-500 text-center">
                {loginErrorMessage}
              </div>
            ) : null}
            <div className="flex flex-row gap-10 text-center justify-center cursor-pointer">
              {loading? <h3 className="text-2xl">Is Loading...</h3> : 
              <input
                type="submit"
                className="items-center h-14 w-full max-w-md border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 bg-green-500 hover:bg-green-600"
                disabled={loading}
              />
              }
            </div>

          </div>

        </div>
      </div>
    </form>
  );
};
