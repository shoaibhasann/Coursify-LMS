import { Link } from "react-router-dom";

import HomePageImage from "../assets/homePageMainImage.png";
import HomeLayout from "../Layouts/HomeLayout";

function HomePage() {

  return (
    <HomeLayout>
      <div className="pt-10 text-white flex flex-col-reverse sm:flex-row items-center justify-center gap-10 mx-6 sm:mx-16 h-[90vh]">
        <div className=" w-full sm:w-1/2 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-semibold">
            Find out best
            <span className="text-green-500 font-bold ml-3">Online Courses</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-200">
            We have a large library of courses taught by highly skilled and
            qualified faculties at a very affordable cost.
          </p>

          <div className=" flex items-center justify-start gap-6 sm:space-x-6">
            <Link to="/courses">
              <button className="bg-green-500 px-5 py-3 rounded-md font-semibold text-base sm:text-lg cursor-pointer hover:bg-green-600 transition-all ease-in-out duration-300">
                Explore courses
              </button>
            </Link>

            <Link to="/contact">
              <button className="border border-green-500 px-5 py-3 rounded-md font-semibold text-base sm:text-lg cursor-pointer hover:bg-green-600 transition-all ease-in-out duration-300">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full sm:w-1/2 flex items-center justify-center">
          <img alt="homepage image" src={HomePageImage} />
        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;
