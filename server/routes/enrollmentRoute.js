const express = require('express')
const route = express.Router()
const async = require('async')
const enrollmentService = require('../services/enrollmentService')

const getAllEnrollment = async (req, res) => {
    if(req.user.role !== 'admin')
    enrollmentService.findByUserId(req.user.id,function (err, result) {
        res.json({
            err: err,
            data : result
        })
    })
    else
    enrollmentService.findAll(function (err, result) {
        res.json({
            err: err,
            data : result
        })
    })
}
const getAllEnrollmentByCourse = async (req, res) => {
    enrollmentService.findByCourseId(req.params.course_id,function (err, result) {
        res.json({
            data : result
        })
    })
}
const createEnrollment = async (req, res) => {
    const data = {
        course_id: req.body.course_id ? req.body.course_id : '',
        user_id: req.body.user_id ? req.body.user_id : '',
    }
    enrollmentService.create(data, function (err, result) {
        res.json({
            err,
            data : result
        })
    })
}
const updateEnrollment = async (req, res) => {
    const data = {
        id: req.body.id,
        course_id: req.body.course_id ? req.body.course_id : '',
        user_id: req.body.user_id ? req.body.user_id : '',
    }
    enrollmentService.update(data, function (err, result) {
        res.json({
            err,
            data : result
        })
    })
}
const deleteEnrollment = async (req, res) => {
		if(!req.body.id)
			return res.badRequest({ message : 'Missing Parameters'})
    // const data = {
    //     id: req.body.id
    // }
    enrollmentService.delete(req.body.id, function (err, result) {
        res.json({
            err,
            result
        })
    })
}
const { isAdmin, isLogin, isTeacher, isNonEditTeacher } = require('../config/policies')

route.get('/', getAllEnrollment)
route.get('/course/:course_id', getAllEnrollmentByCourse)
route.post('/create', isTeacher, createEnrollment)
route.patch('/update', isTeacher, updateEnrollment)
route.post('/delete', isTeacher, deleteEnrollment)

module.exports = route