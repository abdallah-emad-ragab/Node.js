const express = require('express');

const appError = require('../utils/appError');
const { ERROR, FAIL, SUCCESS } = require("../utils/httpStatusText");

// multer package to upload files
const multer = require("multer");
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("File:", file);
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + file.mimetype.replace("image/", "."));
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        return cb(null, true); // return true with no error
    } else {
        return cb(appError(400, "Only image files are allowed", FAIL), false); // return false with error
    }
}
const upload = multer({ storage: diskStorage, fileFilter });

const { getAllUsers, registerUser, loginUser, deleteUser } = require("../controllers/user_controller");
const verifyToken = require("../middlewares/verifyToken");
const allowedRoles = require('../middlewares/allowedRoles');
const { ADMIN } = require('../utils/userRoles');

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.delete("/:id", verifyToken, allowedRoles(ADMIN), deleteUser);

module.exports = router;