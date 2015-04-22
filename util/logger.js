/**
 * Created by Bogdan on 21.4.2015..
 */
var winston = require('winston');
var logConfig = require('../config/log.js');
var transports = [];

transports.push(new winston.transports.DailyRotateFile({
    datePattern: '.yyyy-MM-dd',
    filename: logConfig.logFilePath + logConfig.logFileName
}));

transports.push(new winston.transports.Console);

var logger = new winston.Logger({transports: transports});

module.exports = logger;
