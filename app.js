const express = require("express");
const flash = require("connect-flash");
const path = require("path");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("./db/pool");
const errorHandler = require("./middlewares/errorHandler");

const authRouter = require("./routes/authRoute");
const messagesRouter = require("./routes/messagesRoute");
const joinRouter = require("./routes/joinRoute");

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// passport.js set up
app.use(
  session({
    store: new pgSession({ pool: pool, tableName: "session" }),
    secret: process.env.SESSION_SECRET || "super_secret_members_club_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, {
          username: { msg: "Incorrect username" },
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, {
          password: { msg: "Incorrect password" },
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.notification = req.flash("notification")[0];
  next();
});

app.use((req, res, next) => {
  res.locals.isAuth = req.user ? true : false;
  res.locals.currentUser = req.user;
  res.locals.isMember = req.user?.is_member || false;
  res.locals.isAdmin = req.user?.is_admin || false;
  next();
});

app.get("/", (req, res) => {
  return res.redirect("/messages");
});

app.use("/auth", authRouter);
app.use("/messages", messagesRouter);
app.use("/join", joinRouter);
app.use(errorHandler);
