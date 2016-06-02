// ENVIRONMENTAL CONFIGURATION FILE

// Invoke 'strict' JavaScript mode
'use strict';

try {
  var dev = require('./dev.js');
} catch(e) {
  var dev = {};
}

module.exports = {
	db: process.env.MONGODB_URI || dev['db'],
	sessionSecret: process.env.SESSION_SECRET || dev['sessionSecret']
};