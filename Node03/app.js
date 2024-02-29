var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressEjsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var emailsRouter = require("./routes/emails");
var authRouter = require("./routes/auth");
const roleRouter = require("./routes/role");
const apiRouter = require("./routes/api");
const authMiddleware = require("./middlewares/auth.middlewares");
const shortRouter = require("./routes/short");

const { User } = require("./models/index");
const passportLocal = require("./passports/passport.local");
const passportGoogle = require("./passports/passport.google");
const passportGithub = require("./passports/passport.github");

var app = express();
app.use(
  session({
    secret: "f8",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findByPk(id);
  done(null, user);
});

passport.use("local", passportLocal);
passport.use("google", passportGoogle);
passport.use("github", passportGithub);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ origin: "*" }));

app.use(expressEjsLayouts);
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/urls", shortRouter);
app.use(authMiddleware);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/emails", emailsRouter);
app.use("/role", roleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = req.flash();
  // res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
