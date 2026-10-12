const User = require("../models/userModel");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");
const { ERROR, FAIL, SUCCESS } = require("../utils/httpStatusText");
const bcrypt = require("bcryptjs"); // package to hash passwords
const jwt = require("jsonwebtoken"); // package to generate JWT tokens

const getAllUsers = asyncWrapper(async (req, res) => {
    // console.log(req.headers); // to check the headers
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const users = await User.find({}, {"__v": false, "password": false}).limit(limit).skip((page - 1) * limit);
    res.json({ status: 200, data: { users } });
})

const registerUser = asyncWrapper(async (req, res) => {
    const { firstName, lastName, email, password, role, avatar } = req.body;
    const oldUser = await User.findOne({email});
    if (oldUser) {
        throw appError(409, "User already exists. Please login", FAIL);
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({firstName, lastName, email, password: hashedPassword, role, avatar});
    await user.save();
    // Generate a JWT token
    const token = jwt.sign({ email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ status: 201, 
        data: { user: { firstName: user.firstName, lastName: user.lastName, email: user.email, 
            role: user.role, avatar: req.file.filename }, token } });
            // req.file is added by multer middleware, it contains the uploaded file information
})

const loginUser = asyncWrapper(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw appError(404, "User not found", FAIL);
    }
    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw appError(401, "Invalid password", FAIL);
    }
    // Generate a JWT token
    const token = jwt.sign({ email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ status: 200, data: { user: { firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }, token } });
})

const deleteUser = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw appError(404, "User not found", FAIL);
    }
    res.json({ status: 200, data: { message: "User deleted successfully" } });
})

module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
    deleteUser
}