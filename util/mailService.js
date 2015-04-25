/**
 * Created by bogdanbegovic on 4/16/15.
 */

var nodemailer = require('nodemailer');
var mailConfig = require('../config/mail');
var logger = require('../util/logger');

var smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        XOAuth2: {
            user: mailConfig.senderEmailAddress,
            clientId: mailConfig.clientID,
            clientSecret: mailConfig.clientSecret,
            refreshToken: mailConfig.refreshToken,
            accessToken: mailConfig.accessToken
        }
    }
});

var mailOptions = function (receiver) {
    'use strict';
    return {
        from: mailConfig.senderEmailAddress,
        to: receiver.email,
        subject: 'CS450app password',
        generateTextFromHTML: true,
        html: 'This is an email from <b>CS450app</b> with you password, for ' + receiver.accountType + ' account <br>' +
        'Your password is <h2><b>' + receiver.password + '<b></h2><br><br>' +
        'Please consider changing password on first login'
    };
};

var changePasswordMail = function (receiver) {
    'use strict';
    return {
        from: mailConfig.senderEmailAddress,
        to: receiver.email,
        subject: 'CS450app password changed',
        generateTextFromHTML: true,
        html: 'This is an email from <b>CS450app</b>. You have successfully changed your password, for ' + receiver.accountType + ' account <br>' +
        'Your password is <h2><b>' + receiver.password + '<b></h2><br><br>'
    };
};


module.exports = {
    sendEmail: function (receiver) {
        smtpTransport.sendMail(mailOptions(receiver), function (error, response) {
            if (error) {
                logger.error(error);
            } else {
                logger.info('Mail success: ' + receiver.email);
            }
            smtpTransport.close();
        });
    },
    changePasswordMail: function (receiver) {
        smtpTransport.sendMail(changePasswordMail(receiver), function (error, response) {
            if (error) {
                logger.error(error);
            } else {
                logger.info('Mail success: ' + receiver.email);
            }
            smtpTransport.close();
        });
    }
};
