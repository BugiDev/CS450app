var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

var configDB = require('./config/database.js');
var mongoose = require('mongoose');
mongoose.connect(configDB.url + configDB.dbName);
var db = mongoose.connection;
db.on('error', function () {
    'use strict';
    console.error('DB connection error!');
});
db.once('open', function () {
    'use strict';
    console.info('DB connection success!');
});

require('./config/passport')(passport);

app.use(logger('dev'));
app.use('/', express.static(path.join(__dirname, 'public/app')));
app.use(cookieParser('bogdanbegovic'));
app.use(bodyParser());

// required for passport
app.use(session({
    secret: 'bogdanbegovic',
    maxAge: new Date(Date.now() + 3600000),
    rolling: true,
    resave: true,
    saveUninitialized: false
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ======================================================================
require('./routes/userMgmt.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    'use strict';
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        'use strict';
        res.status(err.status || 500);
        res.json(err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    'use strict';
    res.status(err.status || 500);
    res.json(err.message);
});
