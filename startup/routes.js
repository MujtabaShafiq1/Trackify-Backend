const express = require("express");
require("express-async-errors");

// Routes
const users = require("../routes/users");

// Middlewares
const invalidRouteMiddleware = require("../middlewares/invalid-route");
const errorMiddleware = require("../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/user", users);
  // app.use("/api/face", store);
  // app.use("/api/baggage", store);
  app.use(invalidRouteMiddleware);
  app.use(errorMiddleware);
};
