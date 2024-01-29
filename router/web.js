const passport = require('passport');
const router = require('express').Router();

const web = (app) => {
  router.get("/auth/facebook", passport.authenticate("facebook"));
  
  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    function (req, res) {
      console.log(req);
    }
  );
  

  return app.use('/', router)
}

module.exports = web;
