const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const codeCheck = "select * from categories where code = :code;"
            const categoryCheck = await sequelize.query(codeCheck,{type: QueryTypes.SELECT, replacements: data})
						if(categoryCheck.length > 0)
							return callback((res) =>  res.badRequest('Category Code already exists. Please use another code.'))
            const queryString = "INSERT INTO categories (code, name, description, parent, position, status) " +
            "VALUES (:code, :name, :description, :parent, :position, :status);"
            const category = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(category){
                callback(null, category)
            }
            else
                callback(res => res.internalServerError('Failed to create category!'))
        }
        catch(err) {
						return callback(res => res.internalServerError(err))
        }
    },
    findAll: async function(req, callback){
        try {
            let queryString = "SELECT * FROM categories"
						if(req.params.category_code && req.main_categories)
							queryString += ` where parent = '${req.params.category_code}'`
						else if(req.main_categories)
							queryString += " where parent is null"
            const categories = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, categories)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(id,callback){
        try {
            const condition = isNaN(parseInt(id)) ? ` code = "${id}" ` : ` id = ${id}`
            const queryString = "SELECT * FROM categories WHERE " + condition
            const categories = await sequelize.query(queryString, {type: QueryTypes.SELECT})
						if(categories.length === 0)
							return callback("No Category found.", null)
            callback(null, categories[0])
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(res, data, callback){
        try {
            const chekParent = "select * from categories where parent = :code;"
            const parent = await sequelize.query(chekParent, {type: QueryTypes.SELECT, replacements : data})
						if(parent.length > 0)
							return res.forbidden("The Category still has Program Study")
            const checkCourse = "select cc.* from course_categories cc left join categories c on c.id = cc.category where c.code = :code;"
            const courses = await sequelize.query(checkCourse, {type: QueryTypes.SELECT, replacements : data})
						if(courses.length > 0)
							return res.forbidden("The Program Study still has Courses")
            const queryString = "DELETE FROM categories WHERE code = :code"
            await sequelize.query(queryString, {type: QueryTypes.DELETE, replacements : data})
            // callback(null, {message: "successfully deleted data"})
						return res.ok({message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE categories SET code=:code, name=:name, description=:description, parent=:parent, position=:position, status=:status WHERE id=:id"
           const categorie_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (categorie_updated){
               callback(null, categorie_updated)
           }
           else
                callback('update categorie failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}