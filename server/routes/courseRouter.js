const express = require('express')
const route = express.Router()
const async = require('async')
const courseService = require('../services/courseService')
const courseCategoryService = require('../services/courseCategoryService')
const topicService= require('../services/topicService')
const topicActivityService= require('../services/topicActivityService')
const categoryService = require('../services/categoryService')
// const e = require('express')
const getCourseInfo = async (req, res) => {
	const id = req.params.course_id

    courseService.findById(id, function(err, result){
		res.json({err, data : result})
	})
}
const getCourseInfoEnroll = async (req, res) => {
	const id = req.params.course_id

    courseService.findByIdWithEnrollment(id, function(err, result){
		console.log({result});
		res.json({err, data : result})
	})
}
const getAllCourse = async (req, res) => {
	courseService.findAll(req, function(err, result){
		res.ok({err, data : result})
	})
}
const getCourseUser = async (req, res) => {
	courseService.findByUserId(req.user.id, function(err, result){
		if(err)
			res.badRequest({err, data: null})
		else
		res.ok({err, data : result})
	})
}

const createCourseCategory = async (req, res) => {
	if(!req.body.course || !req.body.category){
		res.json({err: 'must include parameter course and category!'})
	}
	else
		courseCategoryService.create(req.body, function(err, result){
			res.json({err, result})
		})
}

const createCourse = async (req, res) => {
	async.waterfall([
		function create_course(cb) {
			const courseInfo = {
				code: req.body.code ? req.body.code : '',
				name: req.body.name ? req.body.name : '',
				shortname: req.body.shortname ? req.body.shortname : '',
				description: req.body.description ? req.body.description : '',
				position: req.body.position ? req.body.position : '',
				status: req.body.status ? req.body.status : '',
				image_url: req.body.image_url? req.body.image_url: '',
			}
			courseService.create(courseInfo, function(err, result){
				if(err)
					return cb({message: err})
				return cb(null, result)	
			})
		},
		function create_course_category(course, cb) {
			
			const data = {
					course: course[0],
					category: req.body.category,
					createdAt: new Date(),
					createdBy: req.user.id,
					updatedAt: null,
					updatedBy: null,
					startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
					endDate: req.body.endDate ? new Date(req.body.endDate) : new Date(),
					status: 1
			}
			courseCategoryService.create(data, function(err, result){
				if(err)
					return cb({message : err})
				// course[0].role_id = result.role_id
				return cb(null, { id : course[0], role_id : result.role_id})
			})
		},
		function create_topic_course(course, cb) {
			if(req.body.topics.courseFormat === 'single') {
				const topicInfo = {
					course_id: course.id ,
					name: req.body.topics.nameOfTopics ? req.body.topics.nameOfTopics: 'Session 1',
					createdAt: new Date(),
					createdBy: req.user.id,
					updatedAt: null,
					updatedBy: null,
					startDate: req.body.topics.startDate ? new Date(req.body.topics.startDate) : new Date(),
					endDate: req.body.topics.endDate ? new Date(req.body.topics.endDate) : null
					}
				topicService.create(topicInfo, function(err, result){
					if(err)
						return cb({message: err})

					const topicActivityInfo = {
						topic_id: result[0],
						activity_id: req.body.topics.activity_id ? req.body.topics.activity_id : '',
						attachment: '',
						createdAt: new Date(),
						createdBy: req.user.id,
						updatedAt: null,
						updatedBy: null,
						}
					topicActivityService.create(topicActivityInfo, function(err, result){
						if(err)
							return cb({message: err})
						else {
							return cb(null, course)
						}
					})
				})
			} else {
				const numberOfTopics = req.body.topics.numberOfTopics
				let arrayTopics = []
				for (let i = 1; i <= numberOfTopics; i++) {
					arrayTopics.push(i)
				}
				async.eachSeries(arrayTopics, async.ensureAsync(function createEachTopic(topicNumber, nextTopic) {
					const topicInfo = {
						course_id: course.id ,
						name: 'Session ' + topicNumber,
						createdAt: new Date(),
						createdBy: req.user.id,
						updatedAt: null,
						updatedBy: null,
						startDate: req.body.topics.startDate ? new Date(req.body.topics.startDate) : new Date(),
						endDate: req.body.topics.endDate ? new Date(req.body.topics.endDate) : null
						}
					topicService.create(topicInfo, function(err, result){
						if(err)
							return nextTopic({message: err})
						return nextTopic(null)	
					})
				}), function endLoop(err) {
					if(err)
						return cb({message: err})
					return cb(null, course)	
				})
			}
		}
	], function end_create_course(err, data) {
		if(err)
			return res.internalServerError(err)
		return res.ok({data})
	})
}
const updateCourse = async (req, res) => {
	const courseInfo = {
		id: req.body.id ? req.body.id : '',
		code: req.body.code ? req.body.code : '',
		name: req.body.name ? req.body.name : '',
		shortname: req.body.shortname ? req.body.shortname : '',
		description: req.body.description ? req.body.description : '',
		status: req.body.status ? req.body.status : '',
		position: req.body.position ? req.body.position : '',
		image_url: req.body.image_url? req.body.image_url: '',
	}
	courseService.update(courseInfo, function(err1, result1){
		if(err1)
			res.json({err: err1, result: result1})
		else {
            const data = {
				id: req.body.course_category_id ? req.body.course_category_id : '',
                course: courseInfo.id,
                category: req.body.category,
                updatedAt: new Date(),
                updatedBy: req.user.id,
                startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
                endDate: req.body.endDate ? new Date(req.body.endDate) : new Date(),
                status: 1
            }
			courseCategoryService.update(data, function(err, result){
				if(err)
					res.json({err, result})
				else {
					result1.role_id = result.role_id
					res.json({err, result: result1})
				}
			})
		}

	})
}

async function deleteCourse(req, res) {
	courseCategoryService.delete(req.params.code, function (err, result) {
		if(err)
			return err(res)	
		return res.ok(result)
	})
}

const { isAdmin, isLogin, isTeacher, isNonEditTeacher } = require('../config/policies')
route.get('/', getAllCourse )
route.get('/user', getCourseUser )
route.get('/info/:course_id', getCourseInfo )
route.get('/info_enroll/:course_id', getCourseInfoEnroll )
route.post('/create', isTeacher, createCourse )
route.patch('/update', isTeacher, updateCourse )
route.post('/createCourseCategory', createCourseCategory )
route.delete('/delete/:code', isTeacher, deleteCourse)

module.exports = route