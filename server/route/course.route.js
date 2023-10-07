import { Router } from "express";
import {
  addLecturesToCourseByID,
  createCourse,
  getAllCourses,
  getLectureByCourseID,
  removeCourse,
  updateCourse,
} from "../controller/course.controller.js";
import { authorizedRoles, authorizedSubscriber, isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/")
  .get(getAllCourses)
  .post(isLoggedIn, authorizedRoles("admin"), upload.single("thumbnail"), createCourse);

router
  .route("/:id")
  .get(isLoggedIn, authorizedSubscriber, getLectureByCourseID)
  .put(isLoggedIn, authorizedRoles("admin"), updateCourse)
  .delete(isLoggedIn, authorizedRoles("admin"), removeCourse)
  .post(isLoggedIn, authorizedRoles("admin"), upload.single("lectureThumbnail"), addLecturesToCourseByID)

export default router;
