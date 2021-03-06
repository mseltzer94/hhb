# Home Heartbeat (HHB) Alarm and Monitoring Service

![Monitoring Hub](https://cloud.githubusercontent.com/assets/2838173/21910209/4bdc8590-d8d8-11e6-9ea1-9373a0213cbb.png)
###Contents:
* [Description](#description)
* [Requirements](#requirements)
* [Installation](#installation)
* [Steps to Run](#steps-to-run)
* [Web Server](#web-server)
* [Alerts](#alerts)
* [Logging](#logging)

## Description

Eaton's Home Heartbeat provides a security hub with multiple sensor types including:
- Water leak sensors
- Open/Closed door sensors
- Garage door tilt sensors
- Motion sensors

However, the device is currently limited because it has no online service or mechanism for sending alerts. **HHB Alarm and Monitoring Service** provides a service to view the current status of the Home Heartbeat and attached sensors and send alerts via email (and SMS).

## Requirements
- Node v6.9.2 or greater
- USB serial FTDI driver
- Homeheart beat is connected on serial port /dev/ttyhhb running at a baudRate of 38400
- A gmail account (recommended to create a separate email account specifically for the service as you must [enable less secure apps](https://www.google.com/settings/security/lesssecureapps))

## Installation
- [Install](http://www.kolinahr.com/documentation/home-heartbeat/usb-drivers-for-the-home-heartbeat/)  the appropriate FTDI serial driver (MacOS, Linux, Windows)
 - For my Raspberry Pi B+, the following worked:
   - Create the file /etc/udev/rules.d/10-home-heartbeat.rules containing the following line of text:
     ```
     SUBSYSTEMS=="usb", ACTION=="add", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="de29", RUN+="/sbin/modprobe ftdi_sio", RUN+="/bin/sh -c 'echo 0403 de29 > /sys/bus/usb-serial/drivers/ftdi_sio/new_id'", SYMLINK+="hhb"
     ```
   - plug in the USB cable connected to the Home Hearbeat base station, and /var/log/messages should say something like:
     ```
     usb 1-1.4: New USB device found, idVendor=0403, idProduct=de29
     usb 1-1.4: New USB device strings: Mfr=1, Product=2, SerialNumber=0
     usb 1-1.4: Product: HHB Basestation
     usb 1-1.4: Manufacturer: Eaton
     ftdi_sio 1-1.4:1.0: FTDI USB Serial Device converter detected
     usb 1-1.4: Detected FT232BM
     usb 1-1.4: FTDI USB Serial Device converter now attached to ttyUSB0
     ```
   - Test the connection to the Home Hearbeat
     - sudo apt-get install screen
     - screen /dev/hhb 38400
       - type "S" (just an uppercase S)
       - you should get something like:
         ```
         STATE="00,FF,0088,0001,00,00,00,00,0000,00,0000,00,00,00000000,00,,"
         STATE="01,FF,0080,0010,00,00,00,00,0000,00,0000,00,00,00000000,00,,"
         STATE="02,00,0040,0002,00,07,00,00,0001,03,0000,00,FF,00000000,00,000D6F000000xxxx,Home Key"
         ...
         STATE="07,05,0034,0017,FF,00,02,00,0000,83,0000,00,00,00000000,00,000D6F000000xxxx,Motion Sensor"
         STATE=DONE
         ```
       - To exit screen, type Control-a \
- Clone this GIT repository
- In the cloned folder, install depedencies by running ``npm install``
- Set the correct serial port device, if needed:
  - homeMonitor.js:
  - SERIAL_PORT = '/dev/ttyhhb';
- npm install forever -g
- sudo ln -s /opt/nodejs/bin/forever /usr/local/bin

## Steps to Run
1. Setup environmental variables for email alerts (assumes you are using gmail, which is currently the only support host, for alerting):
```
export MAILEREMAILADDRESS=email 
export MAILEREMAILPASSWORD=emailpassword
```
* **NOTE**: To ensure that email notifications are set properly, the service will check for environmental variables and test with gmail that they are valid. The service will not start without these. 
MAILEMAILADDRESS is the username only, not the full email address. Example: myname@gmail.com ==> MAILEREMAILADDRESS=myname

2. There are two ways to start the Service
  * `node start` will start the service as a normal process
  * `forever start -c "npm start" ./` will start the service to be run in the background (require forever to be installed, run ``npm install -g forever`` before running this command)
  
3. If power fails, it's important for hhb to run on a reboot.
One approach:
Add a line to /etc/rc.local:
```
  /home/pi/hhb.sh &
```
/home/pi/hhb.sh contains:
```
#!/bin/sh
export MAILEREMAILADDRESS=<email_address_name>
export MAILEREMAILPASSWORD=xxxxxxxxxx
cd /home/pi/hhb
/usr/local/bin/forever start -c "/usr/local/bin/npm start" ./
```
## My setup
- Rasperry Pi B+ running Jessie connected over USB to Home Heartbeat

## Web Server
* The server is only available locally (inside a network) for security reasons
* The front end may viewed at localhost:8080
* It displays all devices, the current status, and allows the user to set Home or Vacation mode rules (see more in alerts)
* Settings (currently email addresses used for alerting) can be updated frm the front end
* Alert rules can be edited from the front end

##Alerts

![Alerts in Monitoring Hub](https://cloud.githubusercontent.com/assets/2838173/21910308/ab86c9e2-d8d8-11e6-9727-6b77f6cad672.png)

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

## Logging
* A log of all changes to devices (with timestamps) is placed into logs/hhb.log


Feedback and any modifications that would make this service more useful are greatly appreciated! Feel free to send a PR or add an issue.

Thanks to [Kolinahr](http://www.kolinahr.com/category/home-heartbeat/) for the thorough documentation on their reverse engineering of the HomeHeartbeat
