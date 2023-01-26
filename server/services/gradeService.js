const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')

module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO course_grade (course_id, user_id, grade) " +
            "VALUES (:course_id, :user_id, :grade);"
            const response = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(response){
                callback(null, response)
            }
            else
                callback(res => res.internalServerError('Failed to submit grade!'))
        }
        catch(err) {
            // callback(err, null)
						callback(res => res.internalServerError(err.message))
        }
    },
    getAll: async function(callback){
        try {
            const queryString = "SELECT * FROM course_grade"
            const enrollment = await sequelize.query(queryString, {type:QueryTypes.SELECT})
            callback(null, enrollment)
        }
        catch(err) {
            // callback(err, null)
						callback(res => res.internalServerError(err.message))
        }
    },
    getAllGradeByCourse: async function(course_code,callback){
        try {
            const condition = ` WHERE c.code = :course_code`
            const queryString = "SELECT cg.*, CONCAT(u.firstname, ' ', u.lastname) as name FROM course_grade cg LEFT JOIN courses c ON c.id = cg.course_id LEFT JOIN users u ON u.id = cg.user_id " + condition
            const enrollment = await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements : {course_code}})
            callback(null, enrollment)
        } catch (err) {
            // callback(err, null)
						callback(res => res.internalServerError(err.message))
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM course_grade WHERE id = :id"
            await sequelize.query(queryString, {type: QueryTypes.DELETE, replacements : {id}})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            // callback(err, null)
						callback(res => res.internalServerError(err.message))
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE course_grade SET grade =:grade WHERE id =:id"
           const grade_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (grade_updated)
            return callback(null, grade_updated)
           else
                // callback('update role failed', null)
						return callback(res => res.internalServerError('update grade failed'))
        } catch (err) {
                // callback(err, null)
						return callback(res => res.internalServerError(err.message))
        }
    }
}