import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CourseCard from "../../components/CourseCard.jsx";
import HomeLayout from "../../layouts/HomeLayout.jsx";
import { fetchCourses } from "../../redux/slices/CourseSlice.js";


function CourseList() {
    const dispatch = useDispatch();

    const { courseData } = useSelector((state) => state?.courses);

    const loadCourses = async () => {
        await dispatch(fetchCourses());
    }

    useEffect(() => {
      loadCourses();
    }, []);
    
  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-20 sm:pt-12 mx-6 sm:mx-auto sm:pl-20 flex flex-col gap-10 text-white">
        <h1 className="text-center text-3xl font-semibold mb-5">
          Explore the courses made by
          <span className="font-bold text-yellow-500 ml-2">Industry experts</span>
        </h1>
        <div className="mb-10 flex flex-wrap gap-14">
          {courseData?.map((element) => {
            return <CourseCard key={element._id} data={element} />;
          })}
        </div>
      </div>
    </HomeLayout>
  );
}

export default CourseList