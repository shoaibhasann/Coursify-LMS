import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../layouts/HomeLayout.jsx";
import { login } from "../redux/slices/AuthSlice.js";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // function to create new account
  const handleLogin = async (e) => {
    e.preventDefault();

    // checking all fields
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all the details.");
      return;
    }

    // dispatch create account action
    const response = await dispatch(login(loginData));
    if (response?.payload?.success) {
      navigate("/");
    }

    navigate("/");
    setLoginData({
      email: "",
      password: "",
    });
  };
  return (
    <HomeLayout>
      <div className="flex overflow-x-auto items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={handleLogin}
          className="flex flex-col justify-center gap-3 rounded-lg p-6 mx-4 sm:mx-0 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Log In</h1>

          <h2 className="text-center text-xl font-semibold">
            Welcome back! Please sign in to access your account.
          </h2>

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
              value={loginData.email}
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
              value={loginData.password}
            />
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-xs text-accent hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="mt-2 bg-green-600 hover:bg-green-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Log In
          </button>

          <p className="flex items-center justify-center gap-2">
            Don&apos;t have an account?
            <Link
              to="/signup"
              className="text-accent cursor-pointer hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Login;
