const express = require('express');
const router = express.Router();

const {
    register,
    login,
    forgotpassword,
    resetpassword,
    getUserDetails
} = require('../controllers/auth')

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/userdetails/:id").get(getUserDetails);

router.route("/forgotpassword").post(forgotpassword);

router.route("/resetpassword/:resetToken").post(resetpassword);

module.exports = router;