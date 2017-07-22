var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dotenv = require('dotenv').config();
var routes = require('./routes');
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
