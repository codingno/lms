const express = require('express')
const route = express.Router()
const async = require('async')
const categoryService = require('../services/categoryService')
// const e = require('express')
const getCategory = async (req, res) => {
    const id = req.params.category_id
    // const user = await sequelize.query('SELECT * FROM users WHERE id=:user_id', { type : sequelize.SELECT, replacements : {user_id} })
    // if(user.length == 0) {
    // 	return res.sendStatus(404)
    // }
    categoryService.findById(id, function (err, result) {
        // console.log({result});
        // if(err){
        // 	res.badRequest(err)
        // }
        // else if(!result)
        // 	res.json({message: 'user not found'})
        // else 
        res.json({
            err,
            data : result
        })
    })
    // res.json({user})
}
const getAllCategory = async (req, res) => {
    categoryService.findAll(req, function (err, result) {
        res.json({
            data : result
        })
    })
}
const createCategory = async (req, res) => {
    const data = {
        code: req.body.code ? req.body.code : '',
        name: req.body.name ? req.body.name : '',
        parent: req.body.parent ? req.body.parent : null,
        position: req.body.position ? req.body.position : null,
        description: req.body.description ? req.body.description : '',
        status: req.body.status ? req.body.status : 1
    }
    categoryService.create(data, function (err, result) {
			if(err)
				return err(res)
			return res.json({
					err,
					data : result
			})
    })
}
const updateCategory = async (req, res) => {
    const data = {
        id: req.body.id,
        code: req.body.code ? req.body.code : '',
        name: req.body.name ? req.body.name : '',
        parent: req.body.parent ? req.body.parent : null,
        position: req.body.position ? req.body.position : null,
        description: req.body.description ? req.body.description : '',
        status: req.body.status ? req.body.status : 1
    }
    categoryService.update(data, function (err, result) {
        res.json({
            err,
            data : result
        })
    })
}
const deleteCategory = async (req, res) => {
    const data = {
        code: req.params.category_code
    }
    categoryService.delete(res, data, function (err, result) {
        // res.json({
        //     err,
        //     result
        // })
    })
}
const isMainCategory = (req, res, next) => {
	req.main_categories = true
	return next()
}
const { isAdmin, isLogin, isTeacher, isNonEditTeacher } = require('../config/policies')
route.get('/', getAllCategory)
// route.get('/:category_code/sub_category', getAllCategory)
route.get('/main_category', isMainCategory, getAllCategory)
route.get('/main_category/:category_code', isMainCategory, getAllCategory)
route.get('/info/:category_id', getCategory)
route.post('/create', isAdmin, createCategory)
route.patch('/update', updateCategory)
route.delete('/delete/:category_code', isAdmin, deleteCategory)

module.exports = route