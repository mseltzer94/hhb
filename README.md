**Home Heartbeat (HHB) Alarm and Monitoring Service**

**Description**

Eaton's HomeHeartbeat provides a security hub with multiple sensor types including:
- Water leak sensors
- Open/Closed door sensors
- Garage door tilt sensors
- Motion sensors

However, the device is currently limited because it has no online service or mechanism for sending alerts. **HHB Alarm and Monitoring Service** provides a service to view the current status of the Home Heartbeat and attached sensors and send alerts via email (and SMS).

### Requirements
- Node v6.9.2 or greater
- USB serial FTDI driver
- Homeheart beat is connected on serial port /dev/ttyUSB0 running at a baudRate of 38400
- A gmail account (recommended to create a separate email account specifically for the service as you must [enable less secure apps](https://www.google.com/settings/security/lesssecureapps))

**Installation**
- [Install](http://www.kolinahr.com/documentation/home-heartbeat/usb-drivers-for-the-home-heartbeat/)  the appropriate FTDI serial driver (MacOS, Linux, Windows)
- Clone this repository
- In the cloned folder, install depedencies by running ``npm install``

**Steps to Run**
1. Setup environmental variables for email alerts (assumes you are using gmail, which is currently the only support host, for alerting):
```
export MAILEREMAILADDRESS=email@gmail.com 
export MAILEREMAILPASSWORD=emailpassword
```
* **NOTE**: To ensure that email notifications are set properly, the service will check for the following environmental variables and test with gmail that they are valid. The service will not start without these. **

2. There are two ways to start the Service
  * `node start` will start the service as a normal process
  * `forever start -c "npm start" ./` will start the service to be run in the background (require forever to be install, run ``npm install -g forever`` before running this command)

**My setup**
- Rasperry Pi B+ running Jessie connected over USB to Home Heartbeat

**Web Server (front end)**
* The server is only available locally (inside a network) for security reasons
* The front end may viewed at localhost:9000
* It displays all devices, the current status, and allows the user to set Home or Vacation mode rules (see more in alerts)
* Settings (currently email addresses used for alerting) can be updated frm the front end
* Alert rules can be edited from the front end

**Alerts**

There are two kinds of alerts:
* User created device specific alerts
  * Alerts can be edited (added, removed and modified) on the front end (recommended) or by editing the file as described below
  * Alerts are specified in the alerts/alert.json file
      * An example file is included in which the email(s) to be alerted may be specified. If SMS alerts are desired there is a [list](https://en.wikipedia.org/wiki/SMS_gateway) of Email to SMS gateways that may be used
      * Each alert is specified with the following:
        * macAddress - the specific device address (which may be found in by visiting the front end as above)
        * field - which field of the device to alert on (for all field look at devices/stateTable.js)
        * fieldContents - what contents of the field to alert on
        * sendOnResolve - if alerts should be sent after the device is out of the alert state (true/false)
        * isVacationOnly - if the alert is only in vacation mode (true/false)


* Generic alerts
  * Alerts are sent out for all devices for low battery, out of range, or other failures reported by the Home Heartbeat

**Logging**
* A log of all changes to devices (with timestamps) is placed into logs/hhb.log


Feedback and any modifications that would make this service more useful are greatly appreciated! Feel free to send a PR or add an issue.

Thanks to [Kolinahr](http://www.kolinahr.com/documentation/home-heartbeat/) for the thorough documentation on their reverse engineering of the HomeHeartbeat
