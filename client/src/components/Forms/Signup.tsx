import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { isPasswordValid } from "../validations/formValidations";
import { TextInputs } from "./TextInputs";
import SignupCoffeeImage from "../../images/SignupImage.jpg";

const usernameErrorMessage = "Username not found";
const passwordErrorMessage =
  "Password must be over 4 characters and one capital letter";
const confirmPasswordErrorMessage = "Passwords are not the same";

export const Signup = () => {
  const { registerUser } = useAuth();

  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const usernameValid = usernameInput.length > 2;
  const passwordValid = isPasswordValid(password);
  const confirmPasswordValid = password === confirmPass;

  const showUsernameError = !usernameValid && error;
  const showPasswordError = !passwordValid && error;
  const showConfirmPasswordError = !confirmPasswordValid && error;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!usernameValid || !passwordValid || !confirmPasswordValid) {
      setError(true);
      return;
    } 
    try {
      await registerUser({
        username: usernameInput,
        password: password,
      }).finally(()=> setLoading(false));
      toast.success("You have been registered :)")
      setError(false);
      navigate("/coffee");
    } catch(err) {
      toast.error("Signup Error");
      console.log(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if(e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      className="flex-col flex min-[320px]:h-screen"
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      onKeyDown={(e) => {
        handleKeyDown(e)
      }}
    >
      <div className="flex max-[765px]:flex-col  lg:flex-row gap-10 items-center">
        <div className="self-center w-[320px] h-full max-[765px]:hidden">
          <img src={SignupCoffeeImage} alt="Coffee Signup Image" />
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
            <h2 className="flex-grow text-center max-[765px]:text-3xl">
              Signup
            </h2>
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
              value={password}
              show={showPasswordError}
              message={passwordErrorMessage}
            />
            <TextInputs
              type="password"
              label="Confirm Password:"
              onChange={(e) => setConfirmPass(e.target.value)}
              value={confirmPass}
              show={showConfirmPasswordError}
              message={confirmPasswordErrorMessage}
            />
            <div className="flex flex-row gap-10 text-center cursor-pointer">
            {loading ? <h3 className="text-2xl">Is Loading...</h3> : 
              <input
                type="submit"
                className="items-center h-14 w-full max-w-md border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 bg-green-500 hover:bg-green-600"
              />
            }
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
