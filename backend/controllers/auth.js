const mongoose = require("mongoose");
const crypto = require('crypto');
const User = require("../models/User");
const Song = require("../models/songModel");
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Find user by email and include password and id in the result
    const userfound = await User.findOne({ email }).select("+password +_id");

    if (!userfound) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    // Match provided password with stored password
    const isMatch = await userfound.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    // Populate user's playlists with track details
    const user = await User.findById(userfound._id)
      .populate({
        path: 'playlists',
        model: 'Playlist', // Referencing the Playlist model
        populate: {
          path: 'tracks.id', // Populating the tracks in each playlist
          model: 'Song', // Referencing the Music model
        },
      });

    // Send token and user details
    sendToken(user, 201, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUserDetails = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Artist" });
  }

  try {

    // Populate user's playlists with track details
    const userdetails = await User.findById(userfound._id)
      .populate({
        path: 'playlists',
        model: 'Playlist', // Referencing the Playlist model
        populate: {
          path: 'tracks.id', // Populating the tracks in each playlist
          model: 'Song', // Referencing the Music model
        },
      });

    res.status(200).json(userdetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching the User Details" });
  }

}

const forgotpassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({email});

    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404))
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const messsage = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be send", 500));
    }
  } catch (error) {
    next(error);
  }
};

const resetpassword = async  (req, res, next) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken, resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken= undefined;
    user.resetPasswordExpire= undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Success"
    })
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotpassword,
  resetpassword,
  getUserDetails,
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, user, token });
}