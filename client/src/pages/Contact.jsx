
import { useState } from "react";
import { toast } from "react-hot-toast";

import axiosInstance from "../helpers/AxiosInstance.js";
import { isEmail } from "../helpers/regexMatcher.js";
import HomeLayout from "../layouts/HomeLayout.jsx";
function Contact() {

    const [contactData, setContactData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleUserInput = (e) => {
        const { name, value } = e.target;

        setContactData({
            ...contactData,
            [name]: value
        });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if(!contactData.name || !contactData.email || !contactData.message){
            toast.error("All fields are mandatory.")
        }

        if(!isEmail(contactData.email)){
            toast.error("Invalid email.")
        }

        try {
            const res = axiosInstance.post("/contact", contactData);
            toast.promise(res, {
                loading: "Submitting your form...",
                success: "Form submitted successfully!",
                error: "Failed to submit form"
            })

            const response = await res;

            if(response?.data?.success){
                console.log(response);
                setContactData({
                  name: "",
                  email: "",
                  message: "",
                });
            }

        } catch (error) {
            toast.error("Operation failed...")
        }
    };

  return (
    <HomeLayout>
      <div className="flex overflow-x-auto items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={submitHandler}
          className="flex flex-col justify-center gap-3 p-6 mx-4 sm:mx-0 text-white w-96 shadow-[0_0_10px_#eab308]"
        >
          <h1 className="text-center text-2xl font-bold">Contact Us</h1>

          <h2 className="text-center text-xl font-semibold">
            We&apos;re here to help!
          </h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              type="text"
              required
              name="name"
              id="name"
              placeholder="Enter your name.."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={contactData.name}
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
              value={contactData.email}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="message" className="font-semibold">
              Message
            </label>
            <textarea
              type="message"
              required
              name="message"
              id="message"
              placeholder="Enter your message.."
              className="bg-transparent px-2 py-1 border resize-none h-32"
              onChange={handleUserInput}
              value={contactData.message}
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Log In
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Contact;
