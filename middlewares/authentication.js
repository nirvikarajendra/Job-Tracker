function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    }
    return res.redirect("/");
  }

module.exports = isLoggedIn;