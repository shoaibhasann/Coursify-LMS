import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout.jsx";
import { getUserData, updateProfile } from "../../redux/slices/AuthSlice.js";

function EditProfile() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [data, setData] = useState({
        username: "",
        previewImage: "",
        avatar: undefined,
        userId: useSelector((state) => state?.auth?.data?._id)
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setData({
            ...data,
            [name] : value
        });
    };

    const handleImageUpload = (e) => {
        e.preventDefault();
        const file = e.target.files[0];

        if(file){
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                setData({
                    ...data,
                    previewImage: reader.result,
                    avatar: file
                })
            })
        }

    }

    const onFormSubmit = async (e) => {
        e.preventDefault();

        if(data.username !== "" && data.username.length < 5){
            toast.error("username must be atleast of 5 characters.")
        }

        const formData = new FormData();

        if(data.username !== ''){
            formData.append("username", data.username);
        }

        if(data.avatar !== undefined){
            formData.append("avatar", data.avatar);
        }

        await dispatch(updateProfile(formData));

        await dispatch(getUserData());

        navigate("/user/profile");

    }
  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          noValidate
          encType="multipart/form-data"
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_gray]"
        >
          <h1 className="text-center text-2xl font-semibold">Edit profile</h1>
          <label className="cursor-pointer" htmlFor="image_uploads">
            {data.previewImage ? (
              <img
                className="w-28 h-28 rounded-full m-auto"
                src={data.previewImage}
              />
            ) : (
              <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
            )}
          </label>
          <input
            onChange={handleImageUpload}
            className="hidden"
            type="file"
            id="image_uploads"
            name="image_uploads"
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-lg font-semibold">
              Username
            </label>
            <input
              required
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              className="bg-transparent px-2 py-1 border"
              value={data.username}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer"
          >
            Update profile
          </button>
          <Link to="/user/profile">
            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
              <AiOutlineArrowLeft /> Go back to profile
            </p>
          </Link>
        </form>
      </div>
    </HomeLayout>
  );
}

export default EditProfile