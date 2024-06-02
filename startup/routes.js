const express = require('express');
require('express-async-errors');

// routes
const users = require('../routes/users');
const faces = require('../routes/faces');
const baggages = require('../routes/baggages');

// middlewares
const invalidRouteMiddleware = require('../middlewares/invalid-route');
const errorMiddleware = require('../middlewares/error');

module.exports = function (app) {
	app.use(express.json());
	app.use('/api/user', users);
	app.use('/api/face', faces);
	app.use('/api/baggage', baggages);
	app.use(errorMiddleware);
};
