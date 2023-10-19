import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { isEmail } from "../../helpers/regexMatcher";
import HomeLayout from "../../layouts/HomeLayout";
import { forgotPassword } from "../../redux/slices/AuthSlice";

function ForgotPassword() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const onFormSubmit = async (e) => {
        e.preventDefault();
        if(email === ""){
            toast.error("Please enter you email.");
        }

        if(!isEmail(email)){
            toast.error("Please enter a valid email.")
        }

        const response = await dispatch(forgotPassword({
            email: email
        }));

        if(response?.payload?.success){
            navigate("/");
        }
    }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_gray]"
        >
          <h1 className="text-center text-2xl font-semibold text-green-400">
            Password Reset
          </h1>
          <p className="border border-black text-black rounded-lg p-4 bg-green-300">
            Forgotten your password? Enter your e-mail address below, and we&apos;ll
            send you an email allowing to reset it.
          </p>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-lg font-semibold">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="bg-transparent px-2 py-1 border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer"
          >
            Reset My Password
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ForgotPassword