
const { Sequelize } = require("sequelize");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  bcrypt = require("bcrypt");
const sequelize = require("../db/database");

module.exports.passport = async function () {
  passport.serializeUser(async function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(async function (user, done) {
    const user_id = user.id;
    try {
    const user_login = await sequelize
      .query(
        "SELECT u.*, r.id role_id, r.name role FROM users u LEFT JOIN user_role ur ON ur.user_id = u.id LEFT JOIN user_auth ua ON ua.user_id = u.id LEFT JOIN roles r ON r.id = ur.role_id WHERE u.id=:user_id",
        {
          type: sequelize.SELECT,
          replacements: {
            user_id,
          },
        }
      )
      // .then((user_login) => {
        if (user_login.length > 0) {
          var allowedInfo = {
            id: user_login[0].id,
            firstname: user_login[0].firstname,
            lastname: user_login[0].lastname,
            email: user_login[0].email,
            name: user_login[0].username,
            role: user_login[0].role,
            role_id: user_login[0].role_id,
						photo : user_login[0].photo,
          };
          done(null, allowedInfo);
        } else done("invalid userid!");
      }
      catch(error) {
        done(error);
      }
  });

  var passportLocalStrategy = new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function onCheckData(req, username, password, done) {
      try {
      const user_login = await sequelize
        .query(
          "SELECT u.*, r.id role_id, r.name role, ua.email, ua.password FROM users u LEFT JOIN user_role ur ON ur.user_id = u.id LEFT JOIN user_auth ua ON ua.user_id = u.id LEFT JOIN roles r ON r.id = ur.role_id WHERE ua.email=:email or u.username=:username",
          {
            type: sequelize.SELECT,
            replacements: {
              email: username,
              username: username
            },
          }
        )
        // .then(user_login => {
          if (user_login.length == 0) {
            return done(null, false, {
              message: "ID atau kata sandi salah",
            });
          }
          bcrypt.compare(password, user_login[0].password, function (err, result) {
            if (err) {
              return done(null, false, {
                message: "Gangguan pada sistem",
              });
            }

            if (!result) {
              return done(null, false, {
                message: "ID atau kata sandi salah",
              });
            }

            var returnuser_login = {
              id: user_login[0].id,
              firstname: user_login[0].firstname,
              lastname: user_login[0].lastname,
              name: user_login[0].username,
              email: user_login[0].email,
              role: user_login[0].role,
              role_id: user_login[0].role_id,
							photo : user_login[0].photo,
            };
            req.user = returnuser_login

            return done(null, returnuser_login, {
              message: "Verifikasi berhasil",
            });
          });
        }
        catch(err) {
          if (err)
            return done(null, false, {
              message: "Gangguan pada sistem",
            });
        };
    }
  );

  passport.use(passportLocalStrategy);
};
