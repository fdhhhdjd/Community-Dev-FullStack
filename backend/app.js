const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const passport = require("passport");
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const cron = require("node-cron");
const { COOKIE_KEY, PORT, NODE_ENV } = process.env;

app.enable("trust proxy");
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: [COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 1000,
    secure: NODE_ENV === "development" ? false : true,
    sameSite: NODE_ENV === "development" ? false : "none",
  })
);
app.use((error, req, res, next) => {
  if (res.headerSent) {
    //res already sent ? => don't send res, just forward the error
    return next(error);
  }
  //else, send a res
  res.status(error.code || 500);
  res.json({
    message: error.message || "An unknown error occurred",
  });
});

//!router import
const User = require("./Routes/UserRoute.js");
const Post = require("./Routes/PostsRoute");
const Upload = require("./Routes/UploadRoute");
const Comment = require("./Routes/CommentsRoute");

//!Link router Main
//?Auth
app.use("/api/auth", User);

//?Post
app.use("/api/post", Post);

//?Comment

app.use("/api/comment", Comment);

//? Image
app.use("/api", Upload);

//! Run Cron
// cron.schedule("*/5 * * * *", function () {
//   CronAdminController.GetAllUserUnCheck();
// });

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

//!Middleware for error
module.exports = app;
