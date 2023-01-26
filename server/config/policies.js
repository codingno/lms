
module.exports = {
	isLogin : (req, res, next) => {
		if(req.user)
			next()
		else 
			res.forbidden("You don't have permission to access this features")
	},
	isAdmin : (req, res, next) => {
		if(req.user && req.user.role_id == 1)
			next()
		else 
			res.forbidden("You don't have permission to access this features")
	},
	isManager : (req, res, next) => {
		if(req.user && req.user.role_id <= 2)
			next()
		else 
			res.forbidden("You don't have permission to access this features")
	},
	isCourseCreator : (req, res, next) => {
		if(req.user && req.user.role_id <= 3)
			next()
		else 
			res.forbidden("You don't have permission to access this features")
	},
	isTeacher : (req, res, next) => {
		if(req.user && req.user.role_id <= 4)
			next()
		else 
			res.forbidden("You don't have permission to access this features")
	},
	isNonEditTeacher : (req, res, next) => {
		if(req.user && req.user.role_id <= 5)
			next()
		else 
			res.forbidden("You don't have permission to access this features")
	},
	isStudent : (req, res, next) => {
		if(req.user && req.user.role_id <= 6)
			next()
		else 
			res.forbidden("You don't have permission to access this features")
	},
	isPublic : (req, res, next) => {
			next()
	},
}