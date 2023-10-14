import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import bulbImage from "../../assets/bulb.png";
import suitcaseImage from "../../assets/suitcase.png";
import verfiedImage from "../../assets/verified.png";
import videoImage from "../../assets/video.png";
import HomeLayout from "../../layouts/HomeLayout";

function CourseDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { role, data } = useSelector((state) => state.auth);

  return (
    <HomeLayout>
      <div className="min-h-[100vh] pt-14 sm:pt-12 px-6 sm:px-20 flex flex-col items-center justify-center text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 py-10 relative justify-items-center">
          <div className="space-y-5">
            <img
              className="w-full h-64"
              alt="thumbnail"
              src={state?.thumbnail?.secure_url}
            />

            <div className="space-y-4">
              <div className="flex flex-col items-start justify-between text-xl">
                <p className="font-semibold">
                  <span className="text-yellow-500 font-bold">
                    Total lectures :{" "}
                  </span>
                  {state?.numberOfLectures}
                </p>

                <p className="font-semibold">
                  <span className="text-yellow-500 font-bold">
                    Instructor : {" "}
                  </span>
                  {state?.instructor}
                </p>

                <p className="font-semibold">
                  <span className="text-yellow-500 font-bold">Language : </span>
                  {state?.language}
                </p>

                <p className="font-semibold">
                  <span className="text-yellow-500 font-bold">Duration : </span>
                  {state?.duration}
                </p>
              </div>

              {role === "ADMIN" || data?.subscription?.status === "active" ? (
                <button
                  onClick={() =>
                    navigate("/course/displaylectures", { state: { ...state } })
                  }
                  className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300"
                >
                  Watch lectures
                </button>
              ) : (
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300"
                >
                  Subscribe
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 text-xl">
            <h1 className="text-3xl font-bold text-yellow-500 mb-5 text-center">
              {state?.title}
            </h1>
            <p>{state?.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-4 sm:gap-20 justify-items-center py-6 mb-8">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="rounded-full h-16 w-16 bg-slate-900 p-4">
              <img
                className="w-full h-full object-cover"
                src={suitcaseImage}
                alt="bulb"
              />
            </div>
            <h3 className="font-bold text-xl text-white">
              Roles After Completion
            </h3>
            <p className="font-medium text-gray-200 text-lg">{state?.roles}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="rounded-full h-16 w-16 bg-slate-900 p-4">
              <img
                className="w-full h-full object-cover"
                src={videoImage}
                alt="bulb"
              />
            </div>
            <h3 className="font-bold text-xl text-white">Learning Mode</h3>
            <p className="font-medium text-gray-200 text-lg">Online</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="rounded-full h-16 w-16 bg-slate-900 p-4">
              <img
                className="w-full h-full object-cover"
                src={bulbImage}
                alt="bulb"
              />
            </div>
            <h3 className="font-bold text-xl text-white">
              Skills You Will Gain
            </h3>
            <p className="font-medium text-gray-200 text-lg text-center">{state?.skills}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="rounded-full h-16 w-16 bg-slate-900 p-4">
              <img
                className="w-full h-full object-cover"
                src={verfiedImage}
                alt="checkbox"
              />
            </div>
            <h3 className="font-bold text-xl text-white tracking-wide">
              Minimum Eligibility
            </h3>
            <p className="font-medium text-gray-300 text-lg">
              {state?.eligibility}
            </p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default CourseDescription;
