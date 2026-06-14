const { body } = require("express-validator");

const validateNewMessage = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be blank")
    .isLength({ max: 32 })
    .withMessage("Title cannot exceed 32 characters"),
  body("text").trim().notEmpty().withMessage("Message cannot be blank"),
];

module.exports = validateNewMessage;
