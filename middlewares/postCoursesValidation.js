const { body } = require("express-validator");

const postCoursesValidation = () => {
    return [
        body("title")
            .notEmpty().withMessage("Title is required")
            .bail() // Stops comming validations if the previous validation fails
            .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),
        body("price")
            .notEmpty().withMessage("Price is required")
            .bail()
            .isNumeric().withMessage("Price must be a number")
            .bail()
            .isLength({ min: 3 }).withMessage("Price must be at least 3 digits long"),
    ]
}

module.exports = postCoursesValidation;