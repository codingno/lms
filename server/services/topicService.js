const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO topic (course_id, name, createdAt, createdBy, updatedAt, updatedBy, startDate, endDate) " +
            "VALUES (:course_id, :name, :createdAt, :createdBy, :updatedAt, :updatedBy, :startDate, :endDate);"
            const topic = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(topic){
                callback(null, topic)
            }
            else
                callback('Failed to create topic!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT * FROM topic ORDER BY startDate, name"
            const topic = await sequelize.query(queryString)
            callback(null, topic)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(topic_id,callback){
        try {
            // const condition = ` id = ${topic_id}`
            const condition = ` id = :topic_id`
            const queryString = "SELECT * FROM topic WHERE " + condition
            const topic = await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements: {topic_id}})
						if(topic.length === 0)
							return callback("No Courses found.", null)
            callback(null, topic[0])
        } catch (err) {
            callback(err, null)
        }
    },
    findByCourseCategory: async function(course_id, user_id,callback){
        try {
            const condition = ` t.course_id = :course_id || c.code = :course_id`
            const queryString = "SELECT t.*, ta.attachment, a.id activity_id, a.name activity_name, ca.attendAt, ca.description attendDescription FROM topic t LEFT JOIN course_attend ca ON t.id = ca.topic_id" + (user_id ? " AND ca.user_id = " + user_id : "") + " LEFT JOIN courses c ON c.id = t.course_id AND ca.status = 1 LEFT JOIN topic_activity ta ON ta.topic_id = t.id LEFT JOIN activity a ON ta.activity_id = a.id WHERE " + condition + " GROUP BY t.id ORDER BY t.startDate, t.name"
            const topic = await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements: {course_id}})
            callback(null, topic)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const checkActivity = "select * from topic_activity where topic_id = :id"
            const activityData = await sequelize.query(checkActivity, {type: QueryTypes.SELECT, replacements : {id}})
						if(activityData.length > 0)
							return callback(res => res.badRequest("Session still have Session Activity."))
            const queryString = "DELETE FROM topic WHERE id = :id"
            await sequelize.query(queryString, {type: QueryTypes.DELETE, replacements : {id}})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(res => res.internalServerError(err.message))
        }
    },
    deleteActivity: async function(id, callback){
        try {
            const queryString = "DELETE FROM topic_activity WHERE id = :id"
            await sequelize.query(queryString, {type: QueryTypes.DELETE, replacements : {id}})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(res => res.internalServerError(err.message))
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE topic SET course_id=:course_id, name=:name, updatedAt=:updatedAt, updatedBy=:updatedBy, startDate=:startDate, endDate=:endDate WHERE id =:id"
           const topic_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (topic_updated){
               callback(null, topic_updated)
           }
           else
                callback('update topic failed', null)
        } catch (err) {
                callback(err, null)
        }
    },
		findByCourseCode : async function (course_code, callback) {
			try {
				const condition = ' WHERE t.course_id = :course_code || c.code = :course_code '
				const queryString = `SELECT t.* FROM topic t LEFT JOIN courses c ON c.id = t.course_id ${condition};`
				const getTopic= await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements: {course_code}})
				callback(null, getTopic)
			} catch (error) {
				callback(res => res.internalServerError(error.message))	
			}	
		}
}