const { Sequelize } = require('sequelize')
const express = require('express')
const route = express.Router()
const async = require('async')
const topicService = require('../services/topicService')
const topicActivityService = require('../services/topicActivityService')
const moment = require('moment')
// const e = require('express')
const getTopicById = async (req, res) => {
	const id = req.params.topic_id

    topicService.findById(id, function(err, result){
		res.json({err, data : result})
	})
}
const getAllTopicByCourseId = async (req, res) => {
	topicService.findByCourseCategory(req.params.course_id || req.query.course_id, req.user.role === "student" ? req.user.id : null,function(err, result){
		const dataResult = []
		if(result.length > 0)
		async.eachSeries(result, async.ensureAsync(function(item, next){
			topicActivityService.findByTopic(item.id, req.user.role == 'student' ? req.user.id : null, function(err, activity){
				item.activity = activity
				item.startDateString = moment(item.startDate).utc().format('MMMM Do YYYY, h:mm a')
				item.endDateString = moment(item.endDate).utc().format('MMMM Do YYYY, h:mm a')
				item.attendAtString = item.attendAt ? moment(item.attendAt).utc().format('MMMM Do YYYY, h:mm a') : null
				dataResult.push(item)
				next()
			})
		}),function(){
			res.ok({err: null, data: dataResult})
		})
		else if(err)
			res.badRequest({err: "Server Error", data: null})
		else
			res.ok({err: "not found", data: result})
	})
}

const createTopic = async (req, res) => {
	const topicInfo = {
		course_id: req.body.course_id ? req.body.course_id : '',
		name: req.body.name ? req.body.name : '',
		createdAt: new Date(),
		createdBy: req.user.id,
		updatedAt: null,
		updatedBy: null,
		startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
		endDate: req.body.endDate ? new Date(req.body.endDate) : null
    }
	topicService.create(topicInfo, function(err, result){
		if(err)
			res.badRequest({message: err, data: null})
		else {
			res.ok({err, data: result})
		}

	})
}
const updateTopic = async (req, res) => {
	const topicInfo = {
		id: req.body.id ? req.body.id : '',
		course_id: req.body.course_id ? req.body.course_id : '',
		name: req.body.name ? req.body.name : '',
		updatedAt: new Date(),
		updatedBy: req.user.id,
		startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
		endDate: req.body.endDate ? new Date(req.body.endDate) : null
	}
	topicService.update(topicInfo, function(err, result){
		if(err)	
            res.badRequest({err, data: null})
        else
            res.ok({err, data: result})

	})
}

async function deleteTopic(req, res) {
	topicService.delete(req.params.id, function (err, result) {
		if(err)
			return err(res)	
		return res.ok(result)
	})	
}

async function deleteTopicActivity(req, res) {
	topicService.deleteActivity(req.params.id, function (err, result) {
		if(err)
			return err(res)	
		return res.ok(result)
	})	
}

async function getAllTopicByCourseCode(req, res) {
	topicService.findByCourseCode(req.params.course_code, function (err, data) {
		if(err)
			return err(res)	
		return res.ok({data})
	})	
}

const { isAdmin, isLogin, isTeacher, isNonEditTeacher } = require('../config/policies')
route.get('/list', getAllTopicByCourseId )
route.get('/list/:course_id', getAllTopicByCourseId )
route.get('/list/manage/:course_code', getAllTopicByCourseCode )
route.get('/info/:topic_id', getTopicById )
route.post('/create', isTeacher, createTopic )
route.patch('/update', isTeacher, updateTopic )
route.delete('/delete/:id', isTeacher, deleteTopic )
route.delete('/activity/delete/:id', isTeacher, deleteTopicActivity )

module.exports = route