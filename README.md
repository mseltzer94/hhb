Home Heartbeat (HHB) Alarm and Monitoring Service
- Sends alerts when a change occurs based on alerts/alert.json
- Requires that HHB is connected on serial port /dev/ttyUSB0 running at a baudRate of 38400

Steps to Run:
- Export MAILEREMAILADDRESS=email@zoho.com
- Export MAILEREMAILPASSWORD=emailpassword
- run node index.js
