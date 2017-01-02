"use strict";
var mailer = require('./mailer');
var alerting = require('./alert.json');
const MESSAGEFAILUREWAITTIME = 5000; //5 sec wait time

function sendAlertHelper(alert, email, attempts){
  mailer.sendAlertEmail(email, alert, function(error){
    if (error && attempts < 5){
      attempts++;
      setTimeout(function(){
        console.log(`Alert: ${alert} send failure to ${email}. Attempt ${attempts}`);
        sendAlertHelper(alert, email, attempts);
      }, MESSAGEFAILUREWAITTIME);
    }
  });
}
exports.sendAlert = function(alert){
  alerting.emails.forEach(function(email){
    sendAlertHelper(alert, email, 0);
  })

}
