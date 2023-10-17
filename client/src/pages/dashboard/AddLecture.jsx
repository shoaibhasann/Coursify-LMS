import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import { addCourseLecture } from "../../redux/slices/LectureSlice";

function AddLecture() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { state: courseDetails } = useLocation();

    const [lectureData, setLectureData] = useState({
        id: courseDetails._id,
        title: "",
        description: "",
        lecture: undefined,
        videoSrc: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLectureData({
            ...lectureData,
            [name]: value
        })
    }

    const handleVideo= (e) => {
        const video = e.target.files[0];
        const source = window.URL.createObjectURL(video);
        console.log(source);
        setLectureData({
            ...lectureData,
            lecture: video,
            videoSrc: source
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!lectureData.title || !lectureData.description || !lectureData.lecture) {
            toast.error("All fields are mandatory.");
            return;
        }

        const response = await dispatch(addCourseLecture(lectureData));

        if (response?.payload?.success) {
            setLectureData({
                id: "",
                title: "",
                description: "",
                lecture: undefined,
                videoSrc: ""
            })
        }
    }

    useEffect(() => {
        if(!courseDetails) navigate("/courses");
    }, [navigate, courseDetails]);

    return (
      <HomeLayout>
        <div className="min-h-[100vh] text-white flex flex-col items-center justify-center gap-10 py-15 mx-16">
          <div className="flex flex-col gap-5 p-4 shadow-[0_0_10px_black] w-96 rounded-lg">
            <header className="flex items-center justify-center relative">
              <button
                className="absolute left-2 text-xl text-green-500"
                onClick={() => navigate(-1)}
              >
                <AiOutlineArrowLeft />
              </button>
              <h1 className="text-xl text-yellow-500 font-semibold ml-1">
                Please fill all the details below
              </h1>
            </header>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="title"
                placeholder="enter the title of the lecture"
                onChange={handleInputChange}
                className="bg-transparent px-3 py-1 border"
                value={lectureData.title}
              />
              <textarea
                type="text"
                name="description"
                placeholder="enter the description of the lecture"
                onChange={handleInputChange}
                className="bg-transparent px-3 py-1 border resize-none overflow-y-scroll h-36"
                value={lectureData.description}
              />
              {lectureData.videoSrc ? (
                <video
                  muted
                  src={lectureData.videoSrc}
                  controls
                  controlsList="nodownload nofullscreen"
                  disablePictureInPicture
                  className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                ></video>
              ) : (
                <div className="h-48 border flex items-center justify-center cursor-pointer">
                  <label
                    className="font-semibold text-cl cursor-pointer"
                    htmlFor="lecture"
                  >
                    Choose your video
                  </label>
                  <input
                    type="file"
                    className="hidden"
                    id="lecture"
                    name="lecture"
                    onChange={handleVideo}
                    accept="video/mp4 video/x-mp4 video/*"
                  />
                </div>
              )}
              <button
                type="submit"
                className="btn btn-outline btn-success py-1 font-semibold text-lg"
              >
                Add new Lecture
              </button>
            </form>
          </div>
        </div>
      </HomeLayout>
    );
}

export default AddLecture