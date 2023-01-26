const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO course_categories (course, category, status, createdAt, createdBy, updatedAt, updatedBy, startDate, endDate) " +
            "VALUES (:course, :category, :status, :createdAt, :createdBy, :updatedAt, :updatedBy, :startDate, :endDate);"
            const course_category = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(course_category){
                callback(null, course_category)
            }
            else
                callback('Failed to create course_category!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT * FROM course_categories"
            const course_categories = await sequelize.query(queryString)
            callback(null, course_categories)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(course_categorie_id,callback){
        try {
            const condition = ` id = ${course_categorie_id}`
            const queryString = "SELECT * FROM course_categories WHERE " + condition
            const course_categories = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, course_categories)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(code, callback){
        try {
            const getCourseInfo = "select * FROM courses WHERE code = :code "
            const dataCourse = await sequelize.query(getCourseInfo, {type: QueryTypes.SELECT, replacements : {code}})
						if(dataCourse.length === 0)
							return callback(res => res.badRequest("Course Not Found."))
						const data = dataCourse[0]
            const getTopic = "select * FROM topic WHERE course_id = :id "
            const dataTopic = await sequelize.query(getTopic, {type: QueryTypes.SELECT, replacements : data })
						if(dataTopic.length > 0)
							return callback(res => res.badRequest("Course still have topics."))
            const deleteCourseCategory = "DELETE FROM course_categories WHERE course = :id "
            await sequelize.query(deleteCourseCategory, {type: QueryTypes.DELETE, replacements : data })
            const queryString = "DELETE FROM courses WHERE code = :code "
            await sequelize.query(queryString, {type: QueryTypes.DELETE, replacements : data })
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(res => res.internalServerError(err.message))
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE course_categories SET course=:course, category=:category, status=:status, updatedAt=:updatedAt, updatedBy=:updatedBy, startDate=:startDate, endDate=:endDate WHERE id =:id"
           const course_categorie_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (course_categorie_updated){
               callback(null, course_categorie_updated)
           }
           else
                callback('update course_categorie failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}