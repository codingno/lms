const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO courses (code, name, shortname, description, image_url, position, status) " +
            "VALUES (:code ,:name, :shortname, :description, :image_url, :position, :status);"
            const course = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(course){
                callback(null, course)
            }
            else
                callback('Failed to create course!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(req, callback){
				const category_code = req.query.category_code
        try {
						const condition = category_code ? ` WHERE ct.code = :category_code` : ``
            
            const queryString = `SELECT c.*, ct.code as category_code, cc.createdBy, group_concat(e.user_id) user_enrollment FROM courses c LEFT JOIN course_categories cc ON cc.course = c.id LEFT JOIN categories ct ON ct.id = cc.category LEFT JOIN enrollment e ON e.course_id = c.id  ${condition} GROUP BY c.id ORDER BY c.position ASC`
            const courses = await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements: {category_code}})
            callback(null, courses)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findByUserId: async function(user_id, callback){
        try {
            let condition = user_id ? 'WhERE e.user_id = ' + user_id + ';': ';'
            const queryString = "SELECT c.* FROM enrollment e LEFT JOIN courses c ON c.id = e.course_id " + condition      
            const courses = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, courses)
        } catch (error) {
            callback('system error', null)
        }
    },
    findById: async function(course_id, callback){
        try {
            let condition = isNaN(parseInt(course_id)) ? ` c.code = "${course_id}" ` : ` c.id = ${course_id}`
            const queryString = "SELECT c.*, ct.id as category, ct.name as category_name, ct.code as category_code FROM courses c LEFT JOIN course_categories cc ON cc.course = c.id LEFT JOIN categories ct ON ct.id = cc.category WHERE " + condition
            const courses = await sequelize.query(queryString, {type: QueryTypes.SELECT})
						if(courses.length === 0)
							return callback("No Courses found.", null)
            callback(null, courses[0])
        } catch (err) {
            callback(err, null)
        }
    },
    findByIdWithEnrollment: async function(course_id, callback){
        try {
            let condition = isNaN(parseInt(course_id)) ? ` c.code = "${course_id}" ` : ` c.id = ${course_id}`
            const enrollment = "SELECT ua.email from enrollment e LEFT JOIN user_auth ua ON e.user_id = ua.user_id WHERE e.course_id = c.id"
            const queryString = "SELECT c.*, ct.id as category, ct.name as category_name, ct.code as category_code, json_arrayagg(ua.email) emails FROM courses c LEFT JOIN course_categories cc ON cc.course = c.id LEFT JOIN categories ct ON ct.id = cc.category LEFT JOIN enrollment e ON e.course_id = c.id LEFT JOIN user_auth ua ON e.user_id = ua.user_id WHERE " + condition + " GROUP BY c.id"
            const courses = await sequelize.query(queryString, {type: QueryTypes.SELECT})
						if(courses.length === 0)
							return callback("No Courses found.", null)
            courses[0].emails = JSON.parse(courses[0].emails)
            callback(null, courses[0])
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM courses WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE courses SET code =:code, name =:name, shortname=:shortname, description=:description, position=:position, status=:status, image_url=:image_url WHERE id =:id;"
           const course_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (course_updated){
               callback(null, course_updated)
           }
           else
                callback('update course failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}