import express from "express";
import flash from "connect-flash";
import path from "path";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import passport from "passport";
import * as passport_local from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "./db/pool.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import errorHandler from "./middlewares/errorHandler.js";

import authRouter from "./routes/authRoute.js";
import messagesRouter from "./routes/messagesRoute.js";
import joinRouter from "./routes/joinRoute.js";

const app = express();
const port = 3000;
const pgSession = ConnectPgSimple(session);
const LocalStrategy = passport_local.Strategy;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdFunction: undefined,
      // Map the internal fields to the database's actual column names
      sessionModelDBProxy: {
        id: "id",
        sid: "sid",
        data: "sess", // Map 'data' to the database 'sess' column
        expiresAt: "expiresAt",
      },
    }),
    secret: process.env.SESSION_SECRET || "super_secret_members_club_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

//  Local Strategy Configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Prisma query to find a user by their username field
      const user = await prisma.users.findFirst({
        where: { username: username },
      });

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

// 2. Serialize User (Saves ID to session cookie)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 3. Deserialize User (Retrieves full user data on subsequent requests)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: id },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(flash());
console.log("flash succssed");

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
