'use strict';
const express = require('express');
const router = express.Router();
const https = require('https');
const Query = require('./model').Query;
const apiKey = process.env.API_KEY;
const apiCx = process.env.API_CX;


// Example query: 
router.param('term', function (req, res, next, term) {
	const offset = req.query.offset || 1;
	const imgReq = https.get(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${apiCx}&q=${term}&searchType=image&start=${offset}&alt=json`, function(imgRes) {
		// console.log('STATUS: ' + imgRes.statusCode);
		// console.log('HEADERS: ' + JSON.stringify(imgRes.headers));

		// Buffer the body entirely for processing as a whole.
		var bodyChunks = [];
		imgRes.on('data', function(chunk) {
			bodyChunks.push(chunk);
		}).on('end', function() {
			const body = JSON.parse(Buffer.concat(bodyChunks));
			const results = body.items.map(function(item){
				return {
					url: item.link,
					snippet: item.snippet,
					thumbnail: item.image.thumbnailLink,
					context: item.image.contextLink
				};
			});
			// Create a Query in DB
			const query = new Query({term:term});
			query.save(function(err) {
				if(err) return next(err);
				res.status(201);
				req.results = results;
				return next();
			});
		});
	}).on('error', function(e) {
		console.log('ERROR: ' + e.message);
		return next(e); 
	});
});

// GET 
// Route for displaying the api user instructions
router.get('/', function(req, res, next) {
	// Render home view
	res.render('index');
});

// GET /api/imagesearch/:term
// Route for displaying the image search
router.get('/api/imagesearch/:term', function(req, res, next) {
	// Render home view
	res.json(req.results);
});

// GET /api/latest/imagesearch
// Route for displaying the latest image searches
router.get('/api/latest/imagesearch', function(req, res, next) {
	// Return the latest queries
	Query.find({},{ "_id": 0 , "__v": 0})
						.sort({when: -1})
						.limit(10)
						.exec(function(err, queries) {
							if(err) return next(err);
							res.json(queries);
						});
});

module.exports = router;