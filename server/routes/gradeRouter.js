const express = require('express')
const route = express.Router()
const async = require('async')
const gradeService = require('../services/gradeService')

async function getAllGrade(req, res) {
	gradeService.getAll(function (err, data) {
		if(err)
			return err(res)	
		return res.ok(data)
	})	
}

async function getAllGradeByCourse(req, res) {
	gradeService.getAllGradeByCourse(req.params.course_code, function (err, data) {
		if(err)
			return err(res)	
		return res.ok(data)
	})	
}

async function createGrade(req, res) {
	if(!req.body.user_id)
		return res.badRequest("user_id data needed.")
	if(!req.body.course_id)
		return res.badRequest("course_id data needed.")
	if(!req.body.grade)
		return res.badRequest("grade data needed.")
	
	gradeService.create(req.body, function (err, data) {
		if(err)
			return err(res)	
		return res.ok({data})
	})	
}

async function updateGrade(req, res) {
	if(!req.body.id)
		return res.badRequest("id data needed.")
	if(!req.body.grade)
		return res.badRequest("grade data needed.")
	
	gradeService.update(req.body, function (err, data) {
		if(err)
			return err(res)	
		return res.ok({data})
	})	
}

async function deleteGrade(req, res) {
	
	gradeService.delete(req.params.id, function (err, data) {
		if(err)
			return err(res)	
		return res.ok({data})
	})	
}

const { isAdmin, isLogin, isTeacher, isNonEditTeacher } = require('../config/policies')

route.get('/', getAllGrade)
route.get('/course/:course_code', getAllGradeByCourse)
route.post('/create', isTeacher, createGrade)
route.patch('/update', isTeacher, updateGrade)
route.delete('/delete/:id', isTeacher, deleteGrade)

module.exports = route