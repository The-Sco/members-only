const { validationResult } = require("express-validator");
const validateSignUpForm = require("../middlewares/validateSignUpForm");
const authDb = require("../db/queries/authentication");

function sinUpGet(req, res, next) {
  try {
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

module.exports = {
  sinUpGet,
  signUpPost,
};
