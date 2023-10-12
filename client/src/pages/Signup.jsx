import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isEmail, isValidPassword } from "../helpers/regexMatcher.js";
import HomeLayout from "../layouts/HomeLayout.jsx";
import { createAccount } from "../redux/slices/AuthSlice.js";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  // function to create new account
  const createNewAccount = async (e) => {
    e.preventDefault();

    // checking all fields
    if (!signupData.username || !signupData.email || !signupData.password) {
      toast.error("Please fill all the details.");
      return;
    }

    // checking name length
    if (signupData.username.length < 5) {
      toast.error("Name must be atleast 5 characters long.");
      return;
    }

    // email validation
    if (!isEmail(signupData.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    // password validation
    if (!isValidPassword(signupData.password)) {
      toast.error("Password should be 6 - 16 character long with atleast a number and special character");
      return;
    }

    const formData = new FormData();

    formData.append("username", signupData.username);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);

    // dispatch create account action
    const response = await dispatch(createAccount(formData));
        if(response?.payload?.success){
            navigate("/");
        }

    navigate("/");
    setSignupData({
      username: "",
      email: "",
      password: "",
    });
  };
  return (
    <HomeLayout>
      <div className="flex overflow-x-auto items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center gap-3 p-6 mx-4 sm:mx-0 text-white w-96 shadow-[0_0_10px_#eab308]"
        >
          <h1 className="text-center text-2xl font-bold">
            Welcome to Coursify
          </h1>

          <h2 className="text-center text-xl font-semibold">
            Sign Up for free
          </h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-semibold">
              Name
            </label>
            <input
              type="text"
              required
              name="username"
              id="username"
              placeholder="Enter your name.."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.username}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email.."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.email}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your password.."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.password}
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Create account
          </button>

          <p className="flex items-center justify-center gap-2">
            Already have an account ?
            <Link
              to="/login"
              className="hover:underline text-accent cursor-pointer"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Signup;
