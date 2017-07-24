const express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	helmet = require('helmet'),
	expressValidator = require('express-validator'),
	dotenv = require('dotenv').config(),
	routes = require('./routes');


var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routes);

app.use(function(req, res, next) {
  res.status(404).json({status: 404, message: "Resource not found."});
});

app.use(function(err, req, res, next) {
	console.log('kkk', err, process.env.ENV == 'dev')

	let message = err.message;
	let error = process.env.ENV == 'dev' ? err : {};
	res.status(500).json({message, error});
});

module.exports = app;
