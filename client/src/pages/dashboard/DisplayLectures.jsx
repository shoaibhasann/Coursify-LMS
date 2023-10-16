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

  return (
    <HomeLayout>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[100vh] pt-15 py-10 text-white">
        {lectures && lectures.length > 0 ? (
          <>
            <div className="text-center text-2xl sm:text-4xl font-semibold text-yellow-500">
              {state?.title}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-10 w-full">
              {/* left section playing videos and displaying course details to admin */}
              <div className="space-y-5 sm:w-[30rem] p-4 mx-1 rounded-md shadow-[0_0_10px_black]">
                <video
                  src={lectures && lectures[currentVideo]?.lecture?.secure_url}
                  className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                  controls
                  disablePictureInPicture
                  muted
                  controlsList="nodownload"
                ></video>
                <div>
                  <h1>
                    <span className="text-yellow-500">Title : </span>
                    {lectures && lectures[currentVideo]?.title}
                  </h1>
                  <p>
                    <span className="text-yellow-500">Description : </span>
                    {lectures && lectures[currentVideo]?.description}
                  </p>
                </div>
              </div>

              {/* right section for displaying list of lectures  */}
              <ul className="sm:w-[30rem] p-4 mx-1 rounded-md shadow-[0_0_10px_black] space-y-4">
                <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                  <p>Lectures List</p>
                  {role === "admin" && (
                    <button
                      onClick={() => navigate("/course/addlecture")}
                      className="btn-primary px-2 py-1 rounded-md font-semibold text-sm"
                    >
                      Add new lecture
                    </button>
                  )}
                </li>
                {lectures &&
                  lectures.map((lecture, index) => (
                    <li className="space-y-2" key={lecture._id}>
                      <p
                        className="cursor-pointer"
                        onClick={() => setCurrentVideo(index)}
                      >
                        <span> Lecture {index + 1} : </span>
                        {lecture.title}
                      </p>
                      {role === "admin" && (
                        <button
                          onClick={() => handleDelete(state._id, lecture._id)}
                          className="btn-secondary px-2 py-1 rounded-md font-semibold text-sm"
                        >
                          Delete Lecture
                        </button>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold">
              Sorry, this course doesn&apos;t have any lectures.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary px-4 py-2 rounded-md font-semibold text-base"
            >
               Go back
            </button>
          </>
        )}
      </div>
    </HomeLayout>
  );
}

export default DisplayLectures