import { validationResult } from "express-validator";
import passport from "passport";
import validateSignUpForm from "../middlewares/validateSignUp.js";
import * as authDb from "../db/queries/authQueries.js";

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
    const doesExsist = await authDb.checkIfUserExists(req.body.username);
    if (!errors.isEmpty() || doesExsist) {
      let mapped = errors.mapped();

      if (doesExsist) {
        mapped = {
          ...mapped,
          username: {
            value: mapped.username?.value || "",
            msg: "User already exists",
          },
        };
      }
      res.render("forms/signUp", { errors: mapped, data: req.body });
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
      req.flash("notification", {
        success: true,
        msg: `Successful registration as @${username}`,
      });
      if (err) {
        return next(err);
      }
      return res.redirect("/messages");
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
      req.flash("notification", {
        success: true,
        msg: `Successful login as @${req.body.username}`,
      });
      return res.redirect("/messages");
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
      res.redirect("/messages");
    });
  });
}

export { sinUpGet, signUpPost, logInGet, logInPost, logOutGet };
