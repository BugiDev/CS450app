/**
 * Created by Bogdan on 18.4.2015..
 */
/**
 * Created by bogdanbegovic on 4/16/15.
 */

module.exports = {
    // route middleware to make sure a user is logged in
    isLoggedIn: function (req, res, next) {
        'use strict';
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.statusCode = 401;
            res.json({poruka: 'ne moze'});
        }
    },
    adminApproved: function (req, res, next) {
        'use strict';
        if (req.isAuthenticated() && req.user.userType === 'ADMIN') {
            return next();
        } else {
            res.statusCode = 401;
            res.json({poruka: 'ne moze'});
        }
    },
    adminAndProfessorApproved: function (req, res, next) {
        'use strict';
        if (req.isAuthenticated() && (req.user.userType === 'ADMIN' || req.user.userType === 'PROFESSOR')) {
            return next();
        } else {
            res.statusCode = 401;
            res.json({poruka: 'ne moze'});
        }
    }
};