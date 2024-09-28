const mongoose = require("mongoose");
const crypto = require('crypto');
const User = require("../models/User");
const Artist = require("../models/artistsModel");
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
        model: 'Playlist',
        populate: {
          path: 'tracks',
          model: 'Song',
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  try {
    // Populate user's playlists with track details and followers
    const userDetails = await User.findById(id)
      .populate({
        path: 'playlists',
        model: 'Playlist',
        populate: {
          path: 'tracks',
          model: 'Song',
        },
      })
      .populate({
        path: 'followings',
        model: 'Artist',
      });

    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(userDetails);

    res.status(200).json(userDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "An error occurred while fetching the user details" });
  }
};


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

// Follow an artist
const followArtist = async (req, res) => {
  const { artistid, userid } = req.body;
  console.log(artistid);
  console.log(userid);

  try {
    const user = await User.findById(userid);
    const artist = await Artist.findById(artistid);

    if (!user || !artist) {
      return res.status(404).json({ message: 'User or Artist not found' });
    }

    if (user.followings.includes(artistid)) {
      return res.status(400).json({ message: 'You are already following this artist' });
    }

    user.followings.push(artistid);
    // artist.followers.push(userid);    

    await user.save();
    // await artist.save();

    res.status(200).json({ message: 'Artist followed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Unfollow an artist
const unfollowArtist = async (req, res) => {
  const { artistid, userid } = req.body;
  console.log(artistid);
  console.log(userid);

  try {
    const user = await User.findById(userid);
    const artist = await Artist.findById(artistid);

    if (!user || !artist) {
      return res.status(404).json({ message: 'User or Artist not found' });
    }

    if (!user.followings.includes(artistid)) {
      return res.status(400).json({ message: 'You are not following this artist' });
    }

    user.followings = user.followings.filter(id => id.toString() !== artistid);
    // artist.followers = artist.followers.filter(id => id.toString() !== userid);

    await user.save();
    // await artist.save();

    res.status(200).json({ message: 'Artist unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  register,
  login,
  forgotpassword,
  resetpassword,
  getUserDetails,
  followArtist,
  unfollowArtist
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, user, token });
}