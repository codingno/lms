const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO activity (name) " +
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
            const queryString = "SELECT * FROM activity"
            const activity = await sequelize.query(queryString, {type:QueryTypes.SELECT})
            callback(null, activity)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(id,callback){
        try {
            const condition = ` id = :id`
            const queryString = "SELECT * FROM activity WHERE " + condition
            const activity = await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements : {id}})
						if(activity.length === 0)
							return callback("No Activity found.", null)
            callback(null, activity[0])
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM activity WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE activity SET name =:name WHERE id =:id"
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