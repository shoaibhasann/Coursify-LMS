import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import { changePassword } from "../../redux/slices/AuthSlice";

function ChangePassword() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState({
        oldPassword: "",
        newPassword: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setData({
            ...data,
            [name]: value
        })
    }

    const onFormSubmit = async (e) => {
        e.preventDefault();

        if(!data.oldPassword || !data.newPassword){
            toast.error("All fields are mandatory");
        }
        if(data.oldPassword === data.newPassword){
            toast.error("Both password can't be same.");
        }

        const response = await dispatch(changePassword({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        }));

        if(response?.payload?.success){
            navigate(-1);
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
            Change Password
          </h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="oldPassword" className="text-lg font-semibold">
              Old Password
            </label>
            <input
              required
              type="password"
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter your old password"
              className="bg-transparent px-2 py-1 border"
              value={data.oldPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className="text-lg font-semibold">
              New Password
            </label>
            <input
              required
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter your new password"
              className="bg-transparent px-2 py-1 border"
              value={data.newPassword}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer"
          >
            Update password
          </button>
          <Link to="/forgot-password">
            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
               forgot your password?
            </p>
          </Link>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ChangePassword;
