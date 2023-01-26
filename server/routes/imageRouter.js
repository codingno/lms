const express = require('express')
const route = express.Router()
const multer = require('multer');
const path = require('path');

// const upload = multer({ dest: 'uploads/images' })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/' + file.fieldname)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + "." +file.originalname.split('.').pop())
  }
})

const upload = multer({ storage: storage })

const uploadImage = 
  (req, res) => {
    const file = req.file.path;
    if (!file) {
      res.status(400).send({
        status: false,
        data: "No File is selected.",
      });
    }
    res.send(file);
		// res.ok({message:"ok"})
  }

const { isAdmin, isLogin, isNonEditTeacher } = require('../config/policies')

route.post('/upload/course',upload.single("course"), uploadImage)
route.post('/upload/user', isLogin, upload.single("user"), uploadImage)

module.exports = route