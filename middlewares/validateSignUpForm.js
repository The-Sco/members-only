const { body } = require("express-validator");

const validateProduct = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name can not be blank")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long")
    .escape(),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name can not be blank")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long")
    .escape(),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username can not be blank")
    .isLength({ min: 3, max: 24 })
    .withMessage("Username must be between 3 and 24 characters")
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password can not be blank")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation can not be blank")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
];

module.exports = validateProduct;
