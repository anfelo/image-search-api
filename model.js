'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuerySchema = new Schema({
		term: String,
		when: {type: Date, default: Date.now}
});

const Query = mongoose.model('Query', QuerySchema);

module.exports.Query = Query;