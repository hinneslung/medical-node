var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var subdomain = require('express-subdomain');
var vhost = require('vhost');

var MongoClient = require('mongodb').MongoClient;

// var qt = require('quickthumb');
// var jwt = require('jsonwebtoken');

var apiRoutes = require('./routes/api');

var app = express();

MongoClient.connect('mongodb://127.0.0.1:27017/droplet', function(err, db) {
	// uncomment after placing your favicon in /_public
	//app.use(favicon(path.join(__dirname, '_public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(session({
		resave: true,
		saveUninitialized: true,
		secret: 'at0w4785ytvm0t7nsuefrc8aarvgj8acfei9qfawe'
	}));

	//custom actions on req
	app.use(function (req, res, next) {
		req.db = db;

		next();
	});

	//domains
	//app.use(vhost('graffitievolution.xyz', express.static(path.join(__dirname, '_public/484/graffiti/app'))));

	//subdomains
	app.use(subdomain('api', apiRoutes));

	//serving static public files
	app.use(express.static(path.join(__dirname, '_public')));
    //app.use('/img', qt.static('/img'));

	//routing
	app.use('/api', apiRoutes);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handlers
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.send(err.message);
	});
});

module.exports = app;
