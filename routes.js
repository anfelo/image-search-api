'use strict';
const express = require('express');
const router = express.Router();

// GET 
// Route for displaying the api user instructions
router.get('/', function(req, res, next) {
	// Render home view
	res.send('This is home route');
});

// GET /api/imagesearch/:term
// Route for displaying the image search
router.get('/api/imagesearch/:term', function(req, res, next) {
	// Render home view
	res.send('The requested term is: ' + req.params.term);
});

// GET /api/latest/imagesearch
// Route for displaying the latest image searches
router.get('/api/latest/imagesearch', function(req, res, next) {
	// Render home view
	res.send('List of latest image searches');
});

module.exports = router;