const joinDb = require("../db/queries/joinQueries");

function joinGet(req, res, next) {
  try {
    if (!req.user) {
      req.flash("notification", {
        success: false,
        msg: `You need to log in to become a member 🤔`,
      });
      return res.redirect("/auth/log-in");
    }
    if (req.user.is_member) {
      const message = `You are already ${req.user.is_admin ? "an admin" : "a member"}`;
      return res.render("forms/joinForm", {
        error: {
          msg: message,
        },
      });
    }

    res.render("forms/joinForm");
  } catch (err) {
    next(err);
  }
}

async function joinPost(req, res, next) {
  try {
    const { code } = req.body;

    if (code === process.env.SECRET_CODE) {
      await joinDb.setMember(req.user.id);
      req.flash("notification", {
        success: true,
        msg: `You are now a member!`,
      });
      return res.redirect("/messages");
    }
    if (code === process.env.ADMIN_CODE) {
      await joinDb.setAdmin(req.user.id);
      req.flash("notification", {
        success: true,
        msg: `You are now an admin!`,
      });
      return res.redirect("/messages");
    }

    res.render("forms/joinForm", {
      error: {
        msg: "Wrong code",
        value: code,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  joinGet,
  joinPost,
};
