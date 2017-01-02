"use strict";
var mailer = require('nodemailer');
var mailOpts = {
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILEREMAILADDRESS,
        pass: process.env.MAILEREMAILPASSWORD
    }
};
var transporter = mailer.createTransport(mailOpts);

var mailOpts = {
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILEREMAILADDRESS,
        pass: process.env.MAILEREMAILPASSWORD
    }
};
var transporterContact = mailer.createTransport(mailOpts);

exports.sendAlertEmail = function(email, alert, cb) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: `"HomeHeartbeat" <${mailOpts.auth.user}>`, // sender address
      to: email, // list of receivers
      subject: alert, // Subject line
      text: alert // plaintext body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return cb("Alert send failure!");
      }
      else {
        return cb(false);
      }
  });
}