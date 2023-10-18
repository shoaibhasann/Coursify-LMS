import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout"
import { deleteCourseLecture, getCourseLecture } from "../../redux/slices/LectureSlice";

function DisplayLectures() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { lectures } = useSelector((state) => state.lecture);
    const { role } = useSelector((state) => state.auth);

    const [currentVideo, setCurrentVideo] = useState(0);

    useEffect(() => {
        if(!state) navigate("/courses");
        dispatch(getCourseLecture(state._id));
    },[]);

    const handleDelete = async (courseId, lectureId) => {
     const response = await dispatch(deleteCourseLecture({courseId, lectureId}));
     if(response?.payload?.success){
        await dispatch(getCourseLecture(courseId));
     }
    }

    let vid = document.getElementById("video");
    console.log(vid);
    

  return (
    <HomeLayout>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[100vh] py-16 sm:py-10 text-wihte mx-[5%]">
        <div className="text-center text-2xl font-semibold text-yellow-500">
          {lectures && lectures.length > 0
            ? (state?.title)
            : "Sorry this course doesn't have lectures yet."}
        </div>

        {lectures && lectures.length > 0 ? (
          <div className="flex flex-col sm:flex-row justify-center gap-10 w-full">
            {/* left section for playing videos and displaying course details to admin */}
            <div className="space-y-5 sm:w-[28rem] p-4 rounded-lg shadow-[0_0_10px_black]">
              <video
                id="video"
                src={lectures && lectures[currentVideo]?.lecture?.secure_url}
                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                controls
                disablePictureInPicture
                muted
                controlsList="nodownload"
              ></video>
              <div>
                <h1>
                  <span className="text-yellow-500"> Title: </span>
                  {lectures && lectures[currentVideo]?.title}
                </h1>
                <p>
                  <span className="text-yellow-500">
                    Description:{" "}
                  </span>
                  {lectures && lectures[currentVideo]?.description}
                </p>
              </div>
            </div>

            {/* right section for displaying list of lectres */}
            <ul className="sm:w-[28rem] p-4 rounded-lg shadow-[0_0_10px_black] flex flex-col justify-around">
              <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                <p className="border-b border-gray-500 pb-1">Lectures list</p>
                {role === "admin" && (
                  <button
                    onClick={() =>
                      navigate("/course/addlecture", { state: { ...state } })
                    }
                    className="btn-primary px-2 py-1 rounded-md font-semibold text-sm"
                  >
                    Add new lecture
                  </button>
                )}
              </li>
              {lectures &&
                lectures.map((lecture, idx) => {
                  return (
                    <li className="space-y-2 border-b border-gray-500 py-4" key={lecture._id}>
                      <p
                        className="cursor-pointer"
                        onClick={() => setCurrentVideo(idx)}
                      >
                        <span> Lecture {idx + 1} : </span>
                        {lecture?.title} 
                        
                      </p>
                      {role === "admin" && (
                        <button
                          onClick={() => handleDelete(state?._id, lecture?._id)}
                          className="btn-accent px-2 py-1 rounded-md font-semibold text-sm"
                        >
                          Delete lecture
                        </button>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : (
          role === "admin" && (
            <button
              onClick={() =>
                navigate("/course/addlecture", { state: { ...state } })
              }
              className="btn btn-outline btn-accent px-2 py-1 rounded-md font-semibold text-lg"
            >
              Add new lecture
            </button>
          )
        )}
      </div>
    </HomeLayout>
  );
}

export default DisplayLectures;