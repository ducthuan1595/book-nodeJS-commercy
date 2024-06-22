const express = require('express');

const route = express.Router();


route.use('/api/v2', require('./v2/index'));


module.exports = route;