const { Sequelize } = require('sequelize')
const moment = require('moment')
const express = require('express')
const route = express.Router()
const async = require('async')
const topicActivityStudentService = require('../services/topicActivityStudentService')
const activityService = require('../services/activityService')
const { isStudent } = require('../config/policies')

const createTopicActivity = async (req, res) => {
	const topicActivityInfo = {
		topic_activity_id: req.body.topic_activity_id ? req.body.topic_activity_id : '',
		user_id: req.user.id,
		attachment: req.body.attachment ? req.body.attachment : '',
		grade: req.body.grade ? req.body.grade : null,
		createdAt: new Date(),
    }
	topicActivityStudentService.create(topicActivityInfo, function(err, result){
		if(err)
			res.badRequest('System Error')
		else {
			res.ok({err, data: result})
		}

	})
}
const updateTopicActivity = async (req, res) => {
	const courseInfo = {
		id: req.body.id ? req.body.id : '',
		topic_activity_id: req.body.topic_activity_id ? req.body.topic_activity_id : '',
		user_id: req.user.id,
		attachment: req.body.attachment ? req.body.attachment : '',
		grade: req.body.grade ? req.body.grade : null,
	}
	topicActivityStudentService.update(courseInfo, function(err, result){
		if(err)	
            res.badRequest({err, data: null})
        else
            res.ok({err, data: result})

	})
}
const findActivityStudent = async (req, res) => {
	topicActivityStudentService.findByTopic(req.params.topic_activity_id, function(err, data){
		if(err)
			return err(res)
		data.map(item => {
			item.createdAt = moment(item.createdAt).utc().format('MMMM Do YYYY, h:mm a')
			return item
		})	
		return res.ok(data)
	})
}

route.post('/create', isStudent, createTopicActivity )
route.post('/update', isStudent, updateTopicActivity )
route.get('/:topic_activity_id', findActivityStudent )

module.exports = route