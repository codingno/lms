const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO roles (name) " +
            "VALUES (:name);"
            const role = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(role){
                callback(null, role)
            }
            else
                callback('Failed to create role!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT * FROM roles"
            const roles = await sequelize.query(queryString, {type:QueryTypes.SELECT})
            callback(null, roles)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(role_id,callback){
        try {
            const condition = ` id IN ${role_id}`
            const queryString = "SELECT * FROM roles WHERE " + condition
            const roles = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, roles)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM roles WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE roles SET name =:name WHERE id =:id"
           const role_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (role_updated){
               callback(null, role_updated)
           }
           else
                callback('update role failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}