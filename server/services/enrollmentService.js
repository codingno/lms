const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO enrollment (course_id, user_id) " +
            "VALUES (:course_id, :user_id);"
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
            const queryString = "SELECT * FROM enrollment"
            const enrollment = await sequelize.query(queryString, {type:QueryTypes.SELECT})
            callback(null, enrollment)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findByUserId: async function(user_id,callback){
        try {
            const condition = ` user_id IN ${user_id}`
            const queryString = "SELECT * FROM enrollment WHERE " + condition
            const enrollment = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, enrollment)
        } catch (err) {
            callback(err, null)
        }
    },
    findByCourseId: async function(course_id,callback){
        try {
            // const condition = ` e.course_id = :course_id || c.code = :course_id `
            const condition = isNaN(parseInt(course_id)) ? ` c.code = :course_id ` : ` c.id = :course_id`
            const queryString = "SELECT e.*, concat(u.firstname, ' ', u.lastname) as name, r.name as role FROM enrollment e LEFT JOIN courses c ON c.id = e.course_id  LEFT JOIN users u ON u.id = e.user_id LEFT JOIN user_role ur ON ur.user_id = u.id LEFT JOIN roles r ON r.id = ur.role_id WHERE " + condition
            const enrollment = await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements : {course_id}})
            callback(null, enrollment)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM enrollment WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE enrollment SET name =:name WHERE id =:id"
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