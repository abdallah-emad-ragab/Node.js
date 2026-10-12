const { validationResult } = require("express-validator")

const Course = require("../models/coursesModel");
const { SUCCESS, FAIL, ERROR } = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getAllCourses = async (req, res) => {
    // making a limit for pagination
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const courses = await Course.find({}, {"__v": false}).limit(limit).skip((page - 1) * limit);
    res.json({ status: 200, data: { courses } });
}

const getSingleCourse = asyncWrapper(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    // Throw error if course not found, and we used appError instead of DRY
    if (!course) {
        return next(appError(404, "Course not found", ERROR));
    };
    return res.json({ status: SUCCESS, data: { course } });
});

const createNewCourse = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(appError(400, errors.array(), ERROR));
    }
    const newCourse = new Course(req.body); // req.body is object containing the data from the request body
    await newCourse.save(); // Save the course to the database
    res.status(201).json({ status: SUCCESS, data: { course: newCourse } }, { "__v": false });
})

const updateCourse = asyncWrapper(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(appError(404, "Course not found", FAIL));
    }
    const courseUpdated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }); // it returns the course after the update
    res.status(200).json({ status: SUCCESS, data: { course: courseUpdated } });
});

const deleteCourse =  asyncWrapper(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(appError(404, "Course not found", FAIL));
    }
    await Course.deleteOne({ _id: course._id });
    res.status(200).json({ status: SUCCESS, data: null });
})

module.exports = {
    getAllCourses,
    getSingleCourse,
    createNewCourse,
    updateCourse,
    deleteCourse
}