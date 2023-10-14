import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import { createNewCourse } from "../../redux/slices/CourseSlice";

function CreateCourse() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    language: "",
    skills: "",
    eligibility: "",
    roles: "",
    instructor: "",
    thumbnail: null,
    previewImage: ""
  });

  const handleImageUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if(file){
      const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", function () {
      setCourseData({
        ...courseData,
        previewImage: this.result,
        thumbnail: file,
      });
    });
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCourseData({
      ...courseData,
      [name]: value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check input fields
    const isEmptyField = Object.values(courseData).find(value => value === "");

    if(isEmptyField){
      toast.error("All fields are mandatory.")
    } else {
      const formData = new FormData();

      // add values in form data
      for(const key in courseData){
        if(key !== 'previewImage'){
          formData.append(key, courseData[key]);
        }
      }

      const response = await dispatch(createNewCourse(formData));

      if(response?.payload?.success){
        navigate("/courses");
      }
    }

  }


  return (
    <HomeLayout>
      <div className="flex items-center justify-center min-h-[100vh] mx-4 pt-20 sm:py-10">
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-5 p-4 text-white w-[700px] my-10 shadow-[0_0_10px_#eab308] relative"
        >
          <Link className="absolute top-6 text-2xl link text-accent cursor-pointer">
            <AiOutlineArrowLeft />
          </Link>

          <h1 className="text-center text-2xl font-bold mb-4">Create New Course</h1>

          <main className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
            <div className="flex flex-col gap-2">
              <div>
                <label htmlFor="image_uploads" className="cursor-pointer">
                  {courseData.previewImage ? (
                    <img
                      className="w-full h-44 m-auto border"
                      src={courseData.previewImage}
                    />
                  ) : (
                    <div className="w-full h-44 m-auto flex items-center justify-center border">
                      <h1 className="font-bold text-lg">
                        Upload your thumbnail...
                      </h1>
                    </div>
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="image_uploads"
                  name="image_uploads"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="title">
                  Course title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter title..."
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="roles">
                  Role after completion
                </label>
                <input
                  required
                  type="text"
                  name="roles"
                  id="roles"
                  placeholder="Enter role..."
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.roles}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="skills">
                  Gain skills
                </label>
                <input
                  required
                  type="text"
                  name="skills"
                  id="skills"
                  placeholder="Enter skills..."
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.skills}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="language">
                  Language
                </label>
                <input
                  required
                  type="text"
                  name="language"
                  id="language"
                  placeholder="Enter language..."
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.language}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="instructor">
                  Course Instructor
                </label>
                <input
                  required
                  type="text"
                  name="instructor"
                  id="instructor"
                  placeholder="Enter instructor..."
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.instructor}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="category">
                  Course category
                </label>
                <input
                  required
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Enter course category"
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.category}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="eligibility">
                  Eligibility
                </label>
                <input
                  required
                  type="text"
                  name="eligibility"
                  id="eligibility"
                  placeholder="Enter eligiblity..."
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.eligibility}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="duration">
                  Course Duration
                </label>
                <input
                  required
                  type="text"
                  name="duration"
                  id="duration"
                  placeholder="Enter eligiblity..."
                  className="bg-transparent px-2 py-1 border"
                  value={courseData.duration}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="description">
                  Course description
                </label>
                <textarea
                  required
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Enter course description"
                  className="bg-transparent px-2 py-1 h-36 overflow-y-scroll resize-none border"
                  value={courseData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </main>

          <button
            type="submit"
            className="w-full py-2 rounded-sm font-semibold text-lg cursor-pointer bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300"
          >
            Create Course
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default CreateCourse