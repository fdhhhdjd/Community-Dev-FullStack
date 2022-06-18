const { validationResult } = require("express-validator");
const passport = require("passport");
const STORAGE = require("../Utils/storage");
const CONSTANTS = require("../Configs/contants");
const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const {
  followNotification,
  removeFollowNotification,
} = require("../Controllers/NotifucationCtl");
require("dotenv").config;
const { OAuth2Client } = require("google-auth-library");
const { CLIENT_URL, GOOGLE_API_KEY, GH_CLIENT_ID, GH_CLIENT_SECRET } =
  process.env;
const client = new OAuth2Client(GOOGLE_API_KEY);
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/drkvr9wta/image/upload/v1647701003/undraw_profile_pic_ic5t_ncxyyo.png";
const userCtrl = {
  Login: async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
      existingUser = await User.findOne({ email }).populate("followedTags");
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Logging in failed, please try again.",
      });
    }

    //user doesn't exist (invalid credentials)
    if (!existingUser) {
      return res.json({
        status: 400,
        msg: "Invalid credentials, login failed!",
      });
    }

    //validate password
    let isValidPassword = false;
    try {
      isValidPassword = await STORAGE.comparePassword(
        password,
        existingUser.password
      );
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Login failed, please check your credentials!",
      });
    }

    //invalid password
    if (!isValidPassword) {
      return res.json({
        status: 400,
        msg: "Invalid credentials, login failed!",
      });
    }

    //everything ok => generate token
    let token;
    try {
      token = STORAGE.createAccessToken({
        userId: existingUser.id,
        email: existingUser.email,
      });
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Login failed, please try again",
      });
    }
    res.json({
      status: 200,
      msg: "Login successful",
      user: {
        name: existingUser.name,
        userId: existingUser.id,
        email: existingUser.email,
        token,
        bio: existingUser.bio,
        avatar: existingUser.avatar,
        tags: existingUser.followedTags,
      },
    });
  },
  Register: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: 400,
        msg: "Data Not Empty,Please Check Input",
      });
    }
    const { name, email, password, avatar } = req.body;
    //check if there is an existing user
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Signing up failed,Email already exits, Please try again!",
      });
    }
    //user already exists => tell him/her to login
    if (existingUser) {
      return res.json({
        status: 400,
        msg: "User already exists, please login instead",
      });
    }
    //hash the password
    let hashedPassword;
    try {
      hashedPassword = await STORAGE.passwordEncryption(password, 12); //12 - number of salting rounds (can't be reverse-engineered)
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Could not create user, please try again",
      });
    }

    // create a new user with hashed password
    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar: avatar,
    });
    //save the user
    try {
      await createdUser.save();
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Signup failed, please try again",
      });
    }
    //generate a token
    let token;
    try {
      token = STORAGE.createAccessToken({
        userId: createdUser.id,
        email: createdUser.email,
      });
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Signup failed, please try again",
      });
    }
    res.status(200).json({
      status: 200,
      msg: "Register Successfully",
      user: {
        name: createdUser.name,
        userId: createdUser.id,
        email: createdUser.email,
        token,
        bio: createdUser.bio,
        avatar: createdUser.avatar,
      },
    });
  },
  LoginGoogle: async (req, res, next) => {
    const { tokenId } = req.body;
    const response = await client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_API_KEY,
    });
    const { name, email, picture, email_verified, sub } = response.payload;
    let existingUser;
    let user;
    let emailVerified;
    if (email_verified) {
      try {
        //Has the user signed in with google before
        emailVerified = true;

        existingUser = await User.findOne({ email }, "-password");
        user = existingUser;
      } catch (err) {
        return res.json({
          status: 400,
          msg: "Signing up failed, please try again",
        });
      }
    }
    if (!existingUser) {
      //create a new user with the name, email from the payload
      //and fictional payload
      emailVerified = false;

      let hashedPassword;
      let password = email + name + email;
      try {
        hashedPassword = await STORAGE.passwordEncryption(password, 12);
      } catch (err) {
        return res.json({
          status: 400,
          msg: "Could not create user, please try again",
        });
      }

      user = new User({
        name,
        email,
        password: hashedPassword,
        avatar: picture || DEFAULT_AVATAR,
      });
      user = user.populate("followedTags");
      try {
        await user.save();
      } catch (err) {
        return res.json({
          status: 400,
          msg: "Signing up failed, please try again",
        });
      }
    }
    let token;
    try {
      token = STORAGE.createAccessToken({
        userId: existingUser.id,
        email: existingUser.email,
      });
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Login failed, please try again",
      });
    }
    res.json({
      user: {
        name: existingUser.name,
        userId: existingUser.id,
        email: existingUser.email,
        token,
        bio: existingUser.bio,
        avatar: existingUser.avatar,
        tags: existingUser.followedTags,
      },
    });
  },
  LoginFacebook: async (req, res, next) => {
    const { userID, accessToken } = req.body;
    console.log(userID, accessToken);
    let urlGraphFacebook = STORAGE.getURIFromTemplate(
      CONSTANTS.STORAGE_GRAPH_FACEBOOK,
      {
        userID,
        accessToken,
      }
    );
    fetch(urlGraphFacebook, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(async (response) => {
        const { name, email } = response;
        let existingUser;
        let user;
        try {
          existingUser = await User.findOne({ email }, "-password").populate(
            "followedTags"
          );
          user = existingUser;
        } catch (err) {
          return res.json({
            status: 400,
            msg: "Login failed, please check your credentials!",
          });
        }
        if (!existingUser) {
          //create a new user with the name, email from the payload
          //and fictional payload
          emailVerified = false;

          let hashedPassword;
          let password = email + name + email;
          try {
            hashedPassword = await STORAGE.passwordEncryption(password, 12);
          } catch (err) {
            return res.json({
              status: 400,
              msg: "Could not create user, please try again",
            });
          }

          user = new User({
            name,
            email,
            password: hashedPassword,
            avatar: picture || DEFAULT_AVATAR,
          });
          user = user.populate("followedTags");
          try {
            await user.save();
          } catch (err) {
            return res.json({
              status: 400,
              msg: "Signing up failed, please try again",
            });
          }
        }
        const token = STORAGE.createAccessToken({
          userId: user.id,
          email: user.email,
        });
        res.status(200).json({
          status: 200,
          msg: "login Successfully",
          user: {
            name: user.name,
            userId: user.id,
            email: user.email,
            token,
            bio: user.bio,
            avatar: user.avatar,
            tags: user.followedTags,
          },
        });
      });
  },
  GetUserId: async (req, res, next) => {
    let { userId } = req.params;
    console.log(userId);
    let user;
    try {
      user = await User.findById(userId, "-password")
        .populate({
          path: "posts",
          populate: {
            path: "tags",
          },
        })
        .populate("followedTags");
      //exclude password, i.e. return only name and email
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Getting user failed, please try again!",
      });
    }
    res.status(200).json({
      status: 200,
      msg: "Get User Id successfully",
      user,
    });
  },
  UpdateUserProfile: async (req, res, next) => {
    const { userId } = req.params;
    const { body } = req;

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      req = { ...req, body: { ...body, avatar: imageUrl } };
    }

    let user;
    try {
      user = User.findByIdAndUpdate(
        userId,
        req.body,
        { new: true },
        (err, data) => {
          if (err) {
            return res.json({
              status: 400,
              msg: "Could not find user to update!",
            });
          } else {
            const { name, id: userId, bio, email, avatar } = data;
            res.status(200).json({
              status: 200,
              msg: "update Successfully",
              user: { name, userId, bio, email, avatar },
            });
          }
        }
      );
    } catch (err) {
      return res.json({
        status: 400,
        msg: "Could not update user!",
      });
    }
  },
  FollowUser: async (req, res, next) => {
    const { userId, followId } = req.body;
    let user;
    try {
      user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { following: followId } },
        { new: true }
      );
      userToFollow = await User.findByIdAndUpdate(
        followId,
        { $addToSet: { followers: userId } },
        { new: true }
      );
      await followNotification(userId, followId);
      return res.status(201).json({
        status: 200,
        msg: "Flowing Successfully!",
        user,
      });
    } catch (err) {
      return res.json({ status: 400, msg: "Follow failed, please try again" });
    }
  },
  unfollowUser: async (req, res, next) => {
    const { userId, followId } = req.body;
    let user;
    try {
      user = await User.findByIdAndUpdate(
        userId,
        { $pull: { following: followId } },
        { new: true }
      );
      userToFollow = await User.findByIdAndUpdate(
        followId,
        { $pull: { followers: userId } },
        { new: true }
      );
      await removeFollowNotification(userId, followId);
      return res.status(201).json({
        status: 200,
        msg: "UnFlowing Successfully!",
        user,
      });
    } catch (err) {
      return res.json({
        status: 400,
        msg: "UnFollow failed, please try again",
      });
    }
  },
};
module.exports = userCtrl;
