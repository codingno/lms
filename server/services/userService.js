const sequelize = require('../db/database')
const {
  QueryTypes
} = require('sequelize')
const userRoleService = require('./userRoleService')
const userAuthService = require('./userAuthService')

module.exports = {
  create: async function (data, callback) {
    this.findByUserId(data.username, async function (err, user) {
      if (err)
        callback(err)
      else if (user) {
        callback('username is used!')
      } else {
        try {
          const queryString = "INSERT INTO users (firstname, lastname, username, code, photo) " +
            "VALUES (:firstname, :lastname, :username, :code, :photo);"
          const user = await sequelize.query(queryString, {
            type: QueryTypes.INSERT,
            replacements: data
          })
					// if (!user)
          //   return callback('Failed to create users!', null)

    			// await this.findByUserId(data.username, function (err, newUser) {
					// 		user_id = newUser.id
					// })
          if (!data.email)
            return callback(null, user)

          const getNewUserQuery = "SELECT id FROM users WHERE username = :username;"
          const newUser = await sequelize.query(getNewUserQuery, {
            type: QueryTypes.SELECT,
            replacements: { username : data.username }
          })
					const user_id = newUser[0].id
          const userAuthQuery = "INSERT INTO user_auth (user_id, username, email) " +
            "VALUES (:user_id, :username, :email);"
          
          const user_auth = await sequelize.query(userAuthQuery, {
            type: QueryTypes.INSERT,
            replacements: { ...data, user_id }
          })
					if(!user_auth)
          	return callback('Failed to create user auth!', null)
					return callback(null, user)
        } catch (err) {
          return callback(err, null)
        }
      }
    })
  },
  findAll: async function (callback) {
    try {
      const queryString = "SELECT u.*, CONCAT(u.firstname, ' ', u.lastname) name, CONCAT(ur.role_id) role_id, CONCAT(r.name) role_name, ua.email FROM users u LEFT JOIN user_role ur ON u.id = ur.user_id LEFT JOIN user_auth ua ON  ua.user_id = u.id LEFT Join roles r ON ur.role_id = r.id GROUP BY u.id"
      const users = await sequelize.query(queryString)
      callback(null, users[0])
    } catch (err) {
      callback(err, null)
    }
  },
  findByUserId: async function (user_id, callback) {
    try {
      // const condition = `AND u.id = :user_id`
      const queryString = "SELECT u.*, ur.role_id, r.name role_name, ua.email FROM users u LEFT JOIN user_role ur ON ur.user_id = u.id LEFT JOIN user_auth ua ON ua.user_id = u.id LEFT JOIN roles r ON ur.role_id = r.id WHERE (u.id=:user_id OR u.username=:username OR ua.email=:email)"
      const user = await sequelize.query(queryString, {
        type: QueryTypes.SELECT,
        replacements: {
          user_id: user_id,
          username: user_id,
          email: user_id
        }
      })
      if (user_id == '')
        callback(null, null)
      else if (user.length > 0) {
				const userInfo = user[0]
        const result = {
					...userInfo,
          // id: user[0].id,
          // firstname: user[0].firstname,
          // lastname: user[0].lastname,
          // username: user[0].username,
          // code: user[0].code,
          // photo: user[0].photo,
          // email: user[0].email,
          roles: user.map(data => {
            return {
              id: data.role_id,
              role_name: data.role_name
            }
          })[0]
        }
        callback(null, result)
      } else
        callback(null, null)
    } catch (err) {
      if(!user_id || user_id == '')
        callback(null, null)
      else
        callback(err, null)
    }
  },
  delete: async function (user_id, callback) {
    userRoleService.delete(user_id, function (errUserRole, result) {
      if (errUserRole)
        callback(errUserRole)
      else
        userAuthService.delete(user_id, async function (errUserAuth, result) {
          if (errUserAuth)
            callback(errUserAuth)
          else {
            try {
              const queryString = "DELETE FROM users WHERE id = :user_id" 
              await sequelize.query(queryString, {
                type: QueryTypes.DELETE, replacements : {user_id}
              })
              callback(null, {
                message: "successfully deleted data"
              })
            } catch (err) {
            	callback(res => res.internalServerError(err.message))
            }
          }
        })
    })
  },
  update: async function (data, callback) {
    try {
      const queryString = "UPDATE users SET firstname=:firstname, lastname=:lastname, username =:username, code =:code, photo = :photo WHERE id =:id"
      const user = await sequelize.query(queryString, {
        type: sequelize.UPDATE,
        replacements: data
      })
      const queryAuth = "UPDATE user_auth SET username =:username, email =:email WHERE user_id =:id"
      const user_auth_updated = await sequelize.query(queryAuth, {
        type: sequelize.UPDATE,
        replacements: data
      })
      if (user_auth_updated) {
        callback(null, user_auth_updated)
      } else
        callback('update user failed', null)
    } catch (err) {
      callback(err, null)
    }
  },
}