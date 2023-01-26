const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO topic_activity_student (topic_activity_id, user_id, attachment, createdAt, grade) " +
            "VALUES (:topic_activity_id, :user_id, :attachment, :createdAt, :grade);"
            const topic_activity = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(topic_activity){
                callback(null, topic_activity)
            }
            else
                callback('Failed to create topic_activity_student!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT * FROM topic_activity_student"
            const topic_activity = await sequelize.query(queryString)
            callback(null, topic_activity)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(topic_activity_id,callback){
        try {
            const condition = ` ta.id = :topic_activity_id`
            const queryString = "SELECT ta.*, a.name activity_name, a.id activity_id FROM topic_activity ta LEFT JOIN activity a ON ta.activity_id = a.id WHERE " + condition
            const topic_activity = await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements : {topic_activity_id}})
						if(topic_activity.length === 0)
							return callback("No Session Activity found.", null)
            callback(null, topic_activity[0])
        } catch (err) {
            callback(err, null)
        }
    },
    findByTopic: async function(topic_activity_id,callback){
        try {
            const condition = ` AND ta.id = ${topic_activity_id}`
            const queryString = `SELECT 
            u.id, u.firstname, u.lastname, tas.attachment, tas.createdAt, tas.grade, tas.id tas_id
            FROM
                enrollment e
                    LEFT JOIN
                users u ON e.user_id = u.id
                    LEFT JOIN
                topic t ON t.course_id = e.course_id
                    LEFT JOIN
                topic_activity ta ON ta.topic_id = t.id
                    LEFT JOIN
                topic_activity_student tas ON tas.user_id = u.id AND tas.topic_activity_id = ta.id
                    LEFT JOIN
                user_role ur ON ur.user_id = u.id
            WHERE ur.role_id = 6 ${condition};`
            const topic_activity = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, topic_activity)
        } catch (err) {
            callback(res => res.internalServerError(err))
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM topic_activity_student WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
					 const attachment = data.attachment ? "attachment=:attachment," : ""
					 const grade = data.grade ? ", grade = :grade" : ""
					 const condition = data.id ? " WHERE id = :id" : "WHERE topic_activity_id=:topic_activity_id AND user_id=:user_id"
           const queryString = `UPDATE topic_activity_student SET ${attachment} createdAt = NOW()${grade} ${condition}`
           const topic_activity_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           console.log(`🚀 ~ file: topicActivityStudentService.js ~ line 84 ~ update:function ~ data`, data)
           console.log(`🚀 ~ file: topicActivityStudentService.js ~ line 84 ~ update:function ~ queryString`, queryString)
           console.log(`🚀 ~ file: topicActivityStudentService.js ~ line 84 ~ update:function ~ topic_activity_updated`, topic_activity_updated)
           if (topic_activity_updated){
               callback(null, topic_activity_updated)
           }
           else
                callback('update topic_activity failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}