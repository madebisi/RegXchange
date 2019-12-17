var express = require("express"),
  passport = require("passport"),
  OAuth2Strategy = require("passport-oauth2"),
  cfg = require("./config"),
  path = require("path"),
  expressLayouts = require("express-ejs-layouts"),
  psCfg = cfg.passport,
  users = cfg.users;

var tokenToProfile = function(token) {
  console.log("tokenToProfile:", token);
};
// Configure Passport for OAuth2.
var oAuth2strategy = new OAuth2Strategy(
  {
    state: true,
    authorizationURL: psCfg.authorizationURL,
    tokenURL: psCfg.tokenURL,
    clientID: psCfg.clientID,
    clientSecret: psCfg.clientSecret,
    callbackURL: psCfg.callbackURL,
    passReqToCallback: true,
    scope: psCfg.scope
  },
  tokenToProfile
);

passport.use(oAuth2strategy);

// Configure Passport deserializing and serializing. if needed

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require("morgan")("dev"));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get("/", function(req, res) {
  var userExists = 0;
  if ("user" in req) {
    userExists = 1;
    console.log("user foound");
  }
  console.log("req.query.code", req.query.code);
  if (req.query && req.query.code) {
    // process the callback from the identity provider
    // cannot find user ob
    req.user = userExists ? req.user : users[0];
  }

  res.render("pages/home", { user: req.user });
});

app.get("/login", function(req, res) {
  res.render("pages/login");
});

app.post(
  "/login",
  passport.authenticate("oauth2", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);

// app.get("/logout", function(req, res) {
//   req.session.destroy(() => res.redirect("/"));
// });

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/profile", require("connect-ensure-login").ensureLoggedIn(), function(
  req,
  res
) {
  var userExists = 0;
  if ("user" in req) {
    userExists = 1;
    console.log("user foound");
  }
  console.log("req.query.code", req.query.code);
  if (req.query && req.query.code) {
    // process the callback from the identity provider
    // cannot find user ob
    req.user = userExists ? req.user : users[0];
  }
  res.render("pages/profile", { user: req.user });
});

var port = process.env.PORT || 3000;
app.listen(port);

console.log(`Listening on port ${port}`);
