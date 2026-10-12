const express = require('express');
const router = express.Router();

const { getAllCourses, getSingleCourse, createNewCourse, updateCourse, deleteCourse } = require("../controllers/courses_controller");
const postCoursesValidation = require("../middlewares/postCoursesValidation");
const verifyToken = require('../middlewares/verifyToken');
const allowedRoles = require('../middlewares/allowedRoles');
const userRoles = require('../utils/userRoles');

router.route("/")
    .get(getAllCourses)
    .post(verifyToken, postCoursesValidation(), createNewCourse);

router.route("/:id")
    .get(getSingleCourse)
    .patch(verifyToken, postCoursesValidation(), updateCourse)
    .delete(verifyToken, allowedRoles(userRoles.ADMIN, userRoles.MANAGER), deleteCourse);

module.exports = router;