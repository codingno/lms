var express = require('express');
var router = express.Router();
var async = require('async')
var loginService = require('../services/loginService')
var registerService = require('../services/registerService');
var userAuthService = require('../services/userAuthService');
var crypto = require('crypto')
var nodemailer = require('nodemailer');
const { sendEmailForgotPass } = require('../services/emailService');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: process.env.EMAIL,
	  pass: process.env.PASSEMAIL
	}
  });
var BaseUrlClient = process.env.BASE_URL_CLIENT || 'localhost:3031'  
  /* GET users listing. */
router.post('/login', function(req, res, next) {
    if(!req.body.email || !req.body.password){
		return res.badRequest({message: 'Incomplete Parameters'});
	  }

	  if(req.user) {
		req.logout();
	  }
  
	  loginService(req, res, next);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.post('/register', function(req, res, next) {
    if(!req.body.email || !req.body.password || !req.body.firstName){
		return res.badRequest({message: 'Incomplete Parameters'});
	  }

	  if(req.user) {
		req.logout();
	  }
  
	  registerService(req, res, next);
});

router.get('/auth/info', (req, res) => {
	if(req.user)
		res.ok({user : req.user})
	else res.ok(null)
});

router.post('/resetPasswordToken', function(req, res){
	async.waterfall([
		function(cb){
			userAuthService.findByEmail(req.body.email, function(err, data) {
				if(err)
					return res.badRequest({err})
				else if(data.length > 0)
					cb(null, data[0])
				else
					return res.badRequest({err: 'email unregistered!'})
			}) 
		},
		function (data,cb) {
			crypto.randomBytes(16, function (err, buffer) {
				var token = buffer.toString('hex');
				var expiredDate = new Date();
	
				expiredDate.setHours(expiredDate.getHours() + 24);
	
				data.resetPasswordToken = token;
				data.resetPasswordExpired = expiredDate;
	
				userAuthService.update(data, function(err, updated) {
					if(err)
						return res.badRequest(err)
					else
						cb(null, data)
				})
			  });			
		},
		function(data, cb) {
			sendEmailForgotPass(data.email, data.resetPasswordToken, function(err, data){
				if(err){
					res.badRequest('failed to send email')
				}
				else
					res.ok('success to send email')
			})
		}
	])
})

router.get('/checkResetToken/:token', function(req, res){
	userAuthService.findByPasswordToken(req.params.token, function(err, data){
		if(err)
			res.badRequest('invalid token')
		else
			res.ok('valid token')
	})
})

router.post('/resetPassword', function(req, res){
	userAuthService.resetPassword(req.body, function(err, data){
		if(err){
			res.badRequest('failed to reset password')
		}
		else
			res.ok('success to reset password')
	})
})

module.exports = router;