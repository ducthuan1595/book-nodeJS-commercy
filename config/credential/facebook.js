const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../../model/user');
require('dotenv').config;

const configFacebook = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        // callbackURL: "http://localhost:3000",
      },
      function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    )
  );
}

module.exports = configFacebook;
