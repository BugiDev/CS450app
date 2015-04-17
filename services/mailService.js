/**
 * Created by bogdanbegovic on 4/16/15.
 */

var nodemailer = require('nodemailer');
var mailConfig = require('../config/mail');

var smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        XOAuth2: {
            user: mailConfig.senderEmailAddress, // Your gmail address.
            // Not @developer.gserviceaccount.com
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

module.exports = {

    sendEmail: function (receiver) {
        'use strict';
        smtpTransport.sendMail(mailOptions(receiver), function (error, response) {
            if (error) {
                console.log('mail error');
                console.log(error);
                console.trace(error);
            } else {
                console.log('mail success');
                console.log(response);
            }
            smtpTransport.close();
        });
    }

};