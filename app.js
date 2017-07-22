'use strict';
const express = require('express');
const jsonParser = require('body-parser').json;
const routes = require('./routes');
const app = express();

// app.use('/static', express.static('public'));
// app.set('view engine', 'pug');
app.use(jsonParser());

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