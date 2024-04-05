const appLogger = require("../utils/logger")
const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect('mongodb://127.0.0.1:27017/trackify')
    .then(() => appLogger.info('Connected to MongoDB'))
    .catch((e) => appLogger.error("Error connecting to MongoDB", e));
}