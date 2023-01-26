const sequelize = require('../db/database')
const {
    QueryTypes
} = require('sequelize')
const bcrypt = require('bcrypt')
const errorWithStatus = (status, message) => {
	const error = new Error(message)
	error.status = status
	return error
}
module.exports = {
    create: async function (data, callback) {
        try {
            const queryString = "INSERT INTO user_auth (user_id, username, email, emailToken, emailTokenExpired, password, resetPasswordToken, resetPasswordExpired) " +
                "VALUES (:user_id, :username, :email, :emailToken, :emailTokenExpired, :password, :resetPasswordToken, :resetPasswordExpired);"
            const user_auth = await sequelize.query(queryString, {
                type: QueryTypes.INSERT,
                replacements: data
            })
            if (user_auth) {
                callback(null, user_auth)
            } else
                callback('Failed to create user_auth!', null)
        } catch (err) {
            callback(err, null)
        }
    },
    findAll: async function (callback) {
        try {
            const queryString = "SELECT * FROM user_auth"
            const user_auths = await sequelize.query(queryString)
            callback(null, user_auths)
        } catch (err) {
            callback(err, null)
        }
    },
    findByUserId: async function (user_id, callback) {
        try {
            const condition = `user_id = ${user_id}`
            const queryString = "SELECT * FROM user_auth WHERE " + condition
            const user_auths = await sequelize.query(queryString, {
                type: QueryTypes.SELECT
            })
            callback(null, user_auths)
        } catch (err) {
            callback(err, null)
        }
    },
    findByPasswordToken: async function (token, callback) {
        try {
            const condition = `resetPasswordToken = '${token}' AND resetPasswordExpired >= NOW()`
            const queryString = "SELECT * FROM user_auth WHERE " + condition
            const user_auths = await sequelize.query(queryString, {
                type: QueryTypes.SELECT
            })
            if (user_auths.length > 0)
                callback(null, user_auths)
            else
                callback('invalid token', user_auths)
        } catch (err) {
            callback(err, null)
        }
    },
    findByEmail: async function (email, callback) {
        try {
            const condition = `email = '${email}'`
            const queryString = "SELECT * FROM user_auth WHERE " + condition
            const user_auths = await sequelize.query(queryString, {
                type: QueryTypes.SELECT
            })
            callback(null, user_auths)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function (user_id, callback) {
        try {
            const queryString = "DELETE FROM user_auth WHERE user_id = :user_id"
            await sequelize.query(queryString, {
                type: QueryTypes.DELETE,
								replacements : {user_id}
            })
            callback(null, {
                message: "successfully deleted data"
            })
        } catch (err) {
            callback(res => res.internalServerError(err.message))
        }
    },
    update: async function (data, callback) {
        try {
            const queryString = "UPDATE user_auth SET username =:username, email =:email, emailToken =:emailToken, emailTokenExpired =:emailTokenExpired, password =:password, resetPasswordToken =:resetPasswordToken, resetPasswordExpired =:resetPasswordExpired WHERE user_id =:user_id"
            const user_auth_updated = await sequelize.query(queryString, {
                type: QueryTypes.UPDATE,
                replacements: data
            })
            if (user_auth_updated) {
                callback(null, user_auth_updated)
            } else
                callback('update user_auth failed', null)
        } catch (err) {
            callback(err, null)
        }
    },
    resetPassword: async function (data, callback) {
        bcrypt.hash(data.password, 8, async function (errHash, hash) {
            if (errHash)
                callback(errHash, null)
            else {
                data.password = hash
                try {
                    const queryString = "UPDATE user_auth SET password =:password, resetPasswordExpired = NOW() WHERE resetPasswordToken =:token"
                    const user_auth_updated = await sequelize.query(queryString, {
                        type: QueryTypes.UPDATE,
                        replacements: data
                    })
                    if (user_auth_updated) {
                        callback(null, user_auth_updated)
                    } else
                        callback('reset passwor failed', null)
                } catch (err) {
                    callback(err, null)
                }
            }
        })
    },
		checkPassword: async function (user_id, password, currentPassword) {
			const userInfo = await sequelize.query("SELECT * FROM user_auth WHERE user_id = :user_id", {
				type : sequelize.SELECT,
				replacements : {user_id}
			})	

			if(userInfo.length === 0)
				throw errorWithStatus(400, 'User not found.')

			const compared = bcrypt.compare(currentPassword, userInfo[0].password)
				// , async function (err, result) {
				// if(err)
				// 	throw Error('System failure occurs.')
			if(!compared) 
				throw errorWithStatus(400, 'Wrong Current Password')
			
			const isChanged = await this.changePassword({ user_id, password })
			
			return isChanged

			// });
		},
    changePassword: async function (data) {
				// try {
        const hash = await bcrypt.hash(data.password, 8)
				//  async function (errHash, hash) {
        //     if (errHash)
				// 			throw Error(errHash)
						data.password = hash

						console.log({data})
						
						const queryString = "UPDATE user_auth SET password =:password WHERE user_id =:user_id"
						const user_auth_updated = await sequelize.query(queryString, {
								type: QueryTypes.UPDATE,
								replacements: data
						})
						if (user_auth_updated) 
								return user_auth_updated
						throw Error('Change password failed.')
				// } catch (error) {
				// 	throw Error(error)	
				// }
        // })
    }
}