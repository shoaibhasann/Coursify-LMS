import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

// function to get all courses
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
      success: true,
      message: "All Courses fetched successfully!",
      courses,
    });
  } catch (error) {
    return next(new AppError("Error while fetching courses", 500));
  }
};

// function to get lecutres of course
const getLectureByCourseID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Invalid course ID.", 400));
    }

    res.status(200).json({
      success: true,
      message: "Course lectures fetched successfully!",
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppError("Error while fetching lectures of course", 500));
  }
};

// function to create new course
const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      instructor,
      skills,
      eligibility,
      language,
      duration,
      roles,
    } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      instructor,
      skills,
      eligibility,
      language,
      duration,
      roles,
      thumbnail: {
        public_id: "Dummy",
        secure_url: "http://dummyurl.com",
      },
    });

    if (!course) {
      return next(
        new AppError("Course could not created, please try again later.", 400)
      );
    }

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "Coursify_Courses",
        });

        if (result) {
          course.thumbnail.public_id = result.public_id;
          course.thumbnail.secure_url = result.secure_url;
        }

        fs.rm(`uploads/${req.file.filename}`);
      } catch (error) {
        return next(new AppError("File uploading failed.", 400));
      }
    }

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully!",
      course,
    });
  } catch (error) {
    return next(error.message || "Error while creating course", 500);
  }
};

// function to update course
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const courseExists = await Course.findById(id);

    if (!courseExists) {
      return next(new AppError("Course doesn't exists with given ID.", 400));
    }

    if (req.file) {
      await cloudinary.v2.uploader.destroy(courseExists.thumbnail.public_id);

      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "Coursify_Courses",
        });

        if (result) {
          courseExists.thumbnail.public_id = result.public_id;
          courseExists.thumbnail.secure_url = result.secure_url;
        }

        fs.rm(`uploads/${req.file.filename}`);

        await courseExists.save();
      } catch (error) {
        return next(new AppError("File uploading failed.", 400));
      }
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: req.body },
      { runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully!",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// function to delete course
const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Course doesn't exists with given ID", 400));
    }

    await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully!",
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Error while deleting course", 500)
    );
  }
};

// function to add new lecture in existing course
const addLecturesToCourseByID = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Course not found with given ID.", 400));
    }

    const lectureData = {
      title,
      description,
      lecture: {
        public_id: "dummy",
        secure_url: "http://dummyurl.com",
      },
    };

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "Coursify_Lectures",
          chunk_size: 50000000, // 50 mb size
          resource_type: "video",
        });

        if (result) {
          lectureData.lecture.public_id = result.public_id;
          lectureData.lecture.secure_url = result.secure_url;
        }

        // remove file from the local storage of server
        fs.rm(`uploads/${req.file.filename}`);
      } catch (error) {
        // Empty the uploads directory without deleting the uploads directory
        for (const file of await fs.readdir("uploads/")) {
          await fs.unlink(path.join("uploads/", file));
        }
        return next(
          new AppError(JSON.stringify(error) || "File uploading failed.", 400)
        );
      }
    }

    course.lectures.push(lectureData);
    course.numberOfLectures = course.lectures.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course lecture added successfully",
      course,
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Error while adding lectures", 500)
    );
  }
};

// function to delete course lecture
const removeCourseLecture = async (req, res, next) => {
  try {
    const { courseId, lectureId } = req.query;

    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }

    if (!lectureId) {
      return next(new AppError("Lecture ID is required", 400));
    }

    const courseExists = await Course.findById(courseId);

    if (!courseExists) {
      return next(new AppError("Invalid ID or Course does not exist.", 400));
    }

    // find the index of lecture using lecture id
    const lectureIndex = courseExists.lectures.findIndex((lecture) => lecture._id.toString() === lectureId.toString());

    // if returned index is -1 then return an error
    if(lectureIndex === -1){
      return next(new AppError("Lecture doen't exist.", 400));
    }

    // delete lecture video from cloudinary
    await cloudinary.v2.uploader.destroy(
      courseExists.lectures[lectureIndex].lecture.public_id,
      {
        resource_type: "video"
      }
    );

    // remove lecture from course
    courseExists.lectures.splice(lectureIndex, 1);

    // update the number of lectures
    courseExists.numberOfLectures = courseExists.lectures.length;

    await courseExists.save();

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully!",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export {
  getAllCourses,
  getLectureByCourseID,
  createCourse,
  updateCourse,
  removeCourse,
  addLecturesToCourseByID,
  removeCourseLecture,
};
