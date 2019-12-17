var appConfig = {
  authorizationURL: "https://staging-auth.wallstreetdocs.com/oauth/authorize",
  tokenURL: "https://staging-auth.wallstreetdocs.com/oauth/token",
  clientID: "coding_test",
  clientSecret: "bwZm5XC6HTlr3fcdzRnD",
  callbackURL: "http://localhost:3000",
  scope: ["openid", "profile"] // see if the API handles Scope
};

var userRecords = [
  {
    id: 1,
    username: "coding_test",
    password: "secret",
    displayName: "Jack Coding test",
    emails: [{ value: "jack@example.com" }]
  },
  {
    id: 2,
    username: "jill",
    password: "birthday",
    displayName: "Jill",
    emails: [{ value: "jill@example.com" }]
  }
];

exports.passport = appConfig;
exports.users = userRecords;
