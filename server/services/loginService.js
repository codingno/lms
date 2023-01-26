const passport = require('passport');

module.exports = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log(err);
      return res.send(500, {message: 'Sistem Error!'});
    }

    if (!user) {
			return res.badRequest({message: 'username or password not match!'});
    }

    req.logIn(user, function(err) {
      if (err) {
        console.log(err);
        return res.send(500, {message: 'Sistem Error!'});
      }
      
      return res.ok(user, 'layout');
    });

  })(req, res, next);
}