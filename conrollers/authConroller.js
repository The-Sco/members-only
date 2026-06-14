const { validationResult } = require("express-validator");
const passport = require("passport");
const validateSignUpForm = require("../middlewares/validateSignUp");
const authDb = require("../db/queries/authQueries");

function sinUpGet(req, res, next) {
  try {
    if (req.user) {
      return res.redirect("/");
    }
    res.render("forms/signUp");
  } catch (err) {
    next(err);
  }
}

const signUpPost = [
  validateSignUpForm,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("forms/signUp", { errors: errors.mapped(), data: req.body });
      return;
    }

    const { first_name, last_name, username, password } = req.body;
    const user = await authDb.newUser(
      first_name,
      last_name,
      username,
      password,
    );

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  },
];

function logInGet(req, res, next) {
  try {
    if (req.user) {
      return res.redirect("/");
    }
    res.render("forms/logInForm");
  } catch (err) {
    next(err);
  }
}

function logInPost(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    }
    if (!user) {
      return res.render("forms/logInForm", {
        data: req.body,
        errors: info,
      });
    }

    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.redirect("/");
    });
  })(req, res, next);
}

function logOutGet(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
}

module.exports = {
  sinUpGet,
  signUpPost,
  logInGet,
  logInPost,
  logOutGet,
};
