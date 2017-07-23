'use strict';
const express = require('express');
const jsonParser = require('body-parser').json;
const routes = require('./routes');
const mongoose = require('mongoose');
const app = express();

// app.use('/static', express.static('public'));
// app.set('view engine', 'pug');
app.use(jsonParser());

// Connection to mongoDB
mongoose.connect('mongodb://localhost:27017/queryHistory');
const db = mongoose.connection;

db.on('error', function(err) {
	console.error('connection error:', err);
});

db.once('open', function() {
	console.log('db connection successful');
});

// Connection to / Routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error Handler
app.use(function(err,req,res,next) {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

const port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server is listening on port", port);
});