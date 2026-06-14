const { validationResult } = require("express-validator");
const validateNewMessage = require("../middlewares/validateNewMessage");
const messagesDb = require("../db/queries/messagesQueries");

async function messagesGet(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/auth/log-in");
    }
    const posts = await messagesDb.getAllMessages(req.user?.is_member || false);
    res.render("pages/index", { posts, isEmpty: posts.length === 0 });
  } catch (err) {
    next(err);
  }
}

async function singleMessageGet(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/auth/log-in");
    }
    const { id } = req.params;
    const post = await messagesDb.getSingleMessage(id, req.user.is_member);
    const isMyPost = post.id === req.user.id;
    res.render("pages/singlePost", { post, isMyPost });
  } catch (err) {
    next(err);
  }
}

function newMessageGet(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/auth/log-in");
    }
    if (!req.user) {
      return res.redirect("/auth/log-in");
    }
    res.render("forms/newMessageForm");
  } catch (err) {
    next(err);
  }
}

const newMessagePost = [
  validateNewMessage,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("forms/newMessageForm", {
          errors: errors.mapped(),
          data: req.body,
        });
      }
      const { title, text } = req.body;
      const user_id = req.user.id;
      await messagesDb.newMessage(user_id, title, text);
      res.redirect("/messages");
    } catch (err) {
      next(err);
    }
  },
];

async function myMessagesGet(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/auth/log-in");
    }
    const posts = await messagesDb.getUserMessages(req.user.id);
    res.render("pages/myMessages", { posts, isEmpty: posts.length === 0 });
  } catch (err) {
    next(err);
  }
}

async function deleteMessagePost(req, res, next) {
  try {
    const { id } = req.params;
    await messagesDb.deleteMessagePost(id);
    res.redirect("/messages");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  messagesGet,
  singleMessageGet,
  newMessageGet,
  newMessagePost,
  myMessagesGet,
  deleteMessagePost,
};
