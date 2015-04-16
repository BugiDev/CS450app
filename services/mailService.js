/**
 * Created by bogdanbegovic on 4/16/15.
 */

var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        XOAuth2: {
            user: 'bogdanbegovic@gmail.com', // Your gmail address.
            // Not @developer.gserviceaccount.com
            clientId: '1052744439136-ghrkdg1mecqehso2ko4cd546ae9purts.apps.googleusercontent.com',
            clientSecret: '7CrB6B9ZPyT7yNemhzFI6TNg',
            refreshToken: '1/ln5u1FSDVbHUqesvrU69uyFJucoeKjFBIkLZ8X5ZnK8MEudVrK5jSpoR30zcRFq6',
            accessToken: 'ya29.VwHR2aRdDZwKuPIUk_U74VlijS-hgG0Gn9SjPyjIdka8ed-3BaJNT5nmCCys5XUw3WYDR_kzgsqtww'
        }
    }
});

var mailOptions = {
    from: 'bogdanbegovic@gmail.com',
    to: 'bogdanbegovic@hotmail.com',
    subject: 'Hello',
    generateTextFromHTML: true,
    html: '<b>Hello world</b>'
};

module.exports = {

    sendEmail: function(){
        'use strict';
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log('mail error');
                console.log(error);
                console.trace(error);
                smtpTransport.close();
                return error;
            } else {
                console.log('mail success');
                console.log(response);
                smtpTransport.close();
                return response;
            }

        });
    }

};