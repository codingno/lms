const { Sequelize } = require('sequelize')
const express = require('express')
const route = express.Router()
const async = require('async')
const topicActivityService = require('../services/topicActivityService')
const activityService = require('../services/activityService')
// const e = require('express')
const getTopicById = async (req, res) => {
	const id = req.params.id

    topicActivityService.findById(id, function(err, result){
		res.json({err, data : result})
	})
}
const getAllActivityByTopicId = async (req, res) => {
	topicActivityService.findByTopic(req.params.id, null, function(err, result){
		res.ok({err, data : result})
	})
}
const getAllActivity = async (req, res) => {
	activityService.findAll(function(err, data){
		if(err){
			res.badRequest({err: 'Bad Request', data: null})
		}
		else
			res.ok({err, data})
	})	
}
const getActivity = async (req, res) => {
	activityService.findById(req.params.id,function(err, data){
		if(err){
			res.badRequest({err: 'Bad Request', data: null})
		}
		else
			res.ok({err, data})
	})	
}

const createTopicActivity = async (req, res) => {
	const topicActivityInfo = {
		topic_id: req.body.topic_id ? req.body.topic_id : '',
		name : req.body.name || '',
		activity_id: req.body.activity_id ? req.body.activity_id : '',
		attachment: req.body.attachment ? req.body.attachment : '',
		createdAt: new Date(),
		createdBy: req.user.id,
		updatedAt: null,
		updatedBy: null,
    }
	topicActivityService.create(topicActivityInfo, function(err, result){
		if(err)
			res.badRequest({message: err, data: null})
		else {
			res.ok({err, data: result})
		}

	})
}
const updateTopicActivity = async (req, res) => {
	const courseInfo = {
		id: req.body.id ? req.body.id : '',
		name : req.body.name || '',
		topic_id: req.body.topic_id ? req.body.topic_id : '',
		activity_id: req.body.activity_id ? req.body.activity_id : '',
		attachment: req.body.attachment ? req.body.attachment : '',
		updatedAt: new Date(),
		updatedBy: req.user.id,
	}
	topicActivityService.update(courseInfo, function(err, result){
		if(err)	
            res.badRequest({err, data: null})
        else
            res.ok({err, data: result})

	})
}
const { isAdmin, isLogin, isTeacher, isNonEditTeacher } = require('../config/policies')
route.get('/', getAllActivity )
route.get('/:id', getActivity )
route.get('/topic/:id', getAllActivityByTopicId )
route.get('/topic_activity/:id', getTopicById )
route.post('/create', isTeacher, createTopicActivity )
route.post('/update', isTeacher, updateTopicActivity )

module.exports = route