"use strict";
var mailer = require('./mailer');
var alerting = require('./alert.json');
const MESSAGEFAILUREWAITTIME = 5000; //5 sec wait time

function sendAlertHelper(alert, body, email, attempts){
  mailer.sendAlertEmail(email, body, alert, function(error){
    if (error){
      attempts++;
      setTimeout(function(){
        console.log(`Alert: ${alert} send failure to ${email}. Error: ${error}. Attempt ${attempts}`);
        sendAlertHelper(alert, body, email, attempts);
      }, MESSAGEFAILUREWAITTIME);
    }
  });
}
exports.sendAlert = function(alert, body){
  alerting.emails.forEach(function(email){
    sendAlertHelper(alert, body, email, 0);
  })
}
