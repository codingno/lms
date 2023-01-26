const { Sequelize } = require('sequelize')
const sequelize = require('../db/database')
const express = require('express')
const route = express.Router()
// const async = require('async')
const userService = require('../services/userService')
const userRoleService = require('../services/userRoleService')
const roleService = require('../services/roleService')
const userAuthService = require('../services/userAuthService')

const getUserInfo = async (req, res) => {
	const user_id = req.params.user_id
	
	userService.findByUserId(user_id, function(err, data){
			res.ok({err, data})
	})
}
const getAllUser = async (req, res) => {
	userService.findAll(function(err, data){
		res.json({err, data})
	})
}

const getAllRoles = (req, res) => {
	roleService.findAll((err, data) => {
		res.ok({err, data})
	})
}

const createUserRole = async (req, res) => {
	if(!req.body.user_id || !req.body.role_id){
		res.json({err: 'must include parameter user_id and role_id!'})
	}
	else
		userRoleService.create(req.body, function(err, data){
			res.json({err, data})
		})
}

const createUser = async (req, res) => {
	if(!req.body.username || !req.body.firstname || !req.body.lastname || !req.body.email)
		return res.badRequest({ message : "Please fill out the form completely."})
	const userInfo = {
		username: req.body.username ? req.body.username : '',
		firstname: req.body.firstname ? req.body.firstname : '',
		lastname: req.body.lastname ? req.body.lastname : '',
		email: req.body.email ? req.body.email : '',
		code: req.body.code ? req.body.code : '',
		photo: req.body.photo ? req.body.photo : '',
	}
	userService.create(userInfo, function(err1, data1){
		if(err1)
			res.internalServerError({message: err1, data: data1})
		else {
			userRoleService.create({user_id: data1[0], role_id: req.body.role_id}, function(err, data){
				if(err)
					res.internalServerError(err)
				else {
					data1.role_id = data.role_id
					res.ok({err, data: data1})
				}
			})
		}
	})
}
const updateUser = async (req, res) => {
	const userInfo = {
		id: req.body.id ? req.body.id : '',
		username: req.body.username ? req.body.username : '',
		firstname: req.body.firstname ? req.body.firstname : '',
		lastname: req.body.lastname ? req.body.lastname : '',
		email: req.body.email ? req.body.email : '',
		code: req.body.code ? req.body.code : '',
		photo: req.body.photo ? req.body.photo : '',
	}
	userService.update(userInfo, function(err1, data1){
		if(err1)
			res.json({err: err1, data: data1})
		else {
			userRoleService.update({user_id: userInfo.id, role_id: req.body.role_id}, function(err, data){
				if(err)
					res.json({err, data})
				else {
					data1.role_id = data.role_id
					res.json({err, data: data1})
				}
			})
		}
	})
}

function deleteUser(req, res) {
	userService.delete(req.params.id, function (err, data) {
		if(err)
			return err(res)	
		res.ok("User successfully deleted.")
	})
}

async function changePasswordUser(req, res) {
	if(!req.body.password || !req.body.currentPassword)
		return res.badRequest('Parameter missing.')
	try {
		userAuthService.checkPassword(req.params.user_id, req.body.password, req.body.currentPassword)
		return res.ok('Password Changed')
	} catch (error) {
		if(error.status === 404)
			return res.badRequest(error)
		return res.internalServerError(error)		
	}	
}

const { isAdmin, isLogin, isNonEditTeacher } = require('../config/policies')

route.get('/', isNonEditTeacher, getAllUser )
route.get('/info/:user_id', isLogin, getUserInfo )
route.get('/roles', isNonEditTeacher, getAllRoles )
route.put('/create', isAdmin, createUser )
route.put('/createUserRole', isAdmin, createUserRole )
route.patch('/update', isLogin, updateUser )
route.patch('/:user_id/changepass', isLogin, changePasswordUser )
route.delete('/delete/:id', isAdmin, deleteUser )

module.exports = route