require('dotenv').config()
const sequelize = require('./db/database')
const path = require('path')
const express = require('express')
const app = express()
const route = require('./routes/route')
const morgan = require('morgan')
const resStatus = require('express-res-status')
const passport = require('passport')
var cookieParser = require('cookie-parser');
var cors = require('cors')

// app.use(morgan('combined'))
app.use(morgan('tiny'))
app.use(express.static("build"));
app.use(express.json())
app.use(resStatus())
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/pasport-local').passport();

if(process.env.APP_ENV === 'development')
	app.use(cors())

// app.use(passport.authenticate('session'));
app.use('/api', route)
app.use('/uploads', express.static("uploads"))

app.get('*', (req, res) => res.sendFile(path.resolve('build', 'index.html')))

var PORT=process.env.PORT
app.listen(PORT, () => console.log("server starting on PORT:", PORT))