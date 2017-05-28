#!/bin/sh
export MAILEREMAILADDRESS=<email_address_name>
export MAILEREMAILPASSWORD=xxxxxxxxxx
cd /home/pi/hhb
/usr/local/bin/forever start -c "/usr/local/bin/npm start" ./
