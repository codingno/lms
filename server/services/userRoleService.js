const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO user_role (user_id, role_id) " +
            "VALUES (:user_id, :role_id);"
            const user_role = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(user_role){
                callback(null, user_role)
            }
            else
                callback('Failed to create user_role!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT * FROM user_role"
            const user_roles = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, user_roles)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findByUserId: async function(user_id, role_id,callback){
        try {
            const condition = `user_id = ${user_id}` + role_id ? ` AND role_id IN ${role_id}` : ''
            const queryString = "SELECT * FROM user_role WHERE " + condition
            const user_roles = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, user_roles)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM user_role WHERE user_id = :id"
            await sequelize.query(queryString, {type: QueryTypes.DELETE, replacements : {id}})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(res => res.internalServerError(err.message))
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE user_role SET role_id =:role_id WHERE user_id =:user_id"
           const user_role_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (user_role_updated){
               callback(null, user_role_updated)
           }
           else
                callback('update user_role failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}