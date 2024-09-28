const express = require('express');
const router = express.Router();

const {
    register,
    login,
    forgotpassword,
    resetpassword,
    getUserDetails,
    followArtist,
    unfollowArtist
} = require('../controllers/auth')

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/userdetails/:id").get(getUserDetails);

router.route("/follow").patch(followArtist);
router.patch('/follow', followArtist);

// router.route("/unfollow").patch(unfollowArtist);
router.patch('/unfollow', unfollowArtist);


// router.route("/forgotpassword").post(forgotpassword);
router.patch('forgotpassword', forgotpassword);


router.route("/resetpassword/:resetToken").post(resetpassword);

module.exports = router;