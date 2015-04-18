/**
 * Created by bogdanbegovic on 4/13/15.
 */

module.exports = function (app, passport, permissionMiddleware, logger) {
    'use strict';

    app.get('/user/logout', permissionMiddleware.isLoggedIn, function (req, res) {
        logger.info('User ' + req.user._id + ' logged out!');
        req.logout();
        res.json(true);
    });

    app.post('/user/auth', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                logger.error(err);
                res.statusCode = 500;
                return next(err);
            }
            if (!user) {
                logger.error(info);
                res.statusCode = 404;
                return res.json(info);

            } else {
                req.logIn(user, function (err) {
                    if (err) {
                        logger.error(err);
                        return next(err);
                    }
                    logger.info('User: ' + user._id + ' Authenticated successfully!');
                    return res.json(user);
                });
            }
        })(req, res, next);
    });

    app.get('/user/isAuthenticated', permissionMiddleware.isLoggedIn, function (req, res) {
        logger.info('User: ' + req.user._id + ' is authenticated?');
        res.json(true);
    });

    app.get('/user/getUserProfile', permissionMiddleware.isLoggedIn, function (req, res) {
        logger.info('Get user profile: ' + req.user._id);
        res.json(req.user);
    });
};