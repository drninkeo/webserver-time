# Screenshot Plugin for [FM-DX-Webserver](https://github.com/NoobishSVK/fm-dx-webserver)

This plugin provides a time display (UTC/LOCAL) for the FM-DX web server.

![image](https://github.com/user-attachments/assets/78308ffd-fed3-4565-b5c8-447286459ac5)





## Version 1.0

- UTC and Local Time supportet (Click on the time display to switch)
- Switch for time display on mobile devices (located in the header of the script)

## Installation notes:

1. [Download](https://github.com/Highpoint2000/webserver-time/releases) the last repository as a zip
2. Unpack all files from the plugins folder to ..fm-dx-webserver-main\plugins\ 
3. Stop or close the fm-dx-webserver
4. Start/Restart the fm-dx-webserver with "npm run webserver" on node.js console, check the console informations
5. Activate the Screenshot plugin in the settings
6. Stop or close the fm-dx-webserver
7. Start/Restart the fm-dx-webserver with "npm run webserver" on node.js console, check the console informations

## Configuration options:

The following variables can be changed in the header of the screenshot.js:

    showTimeOnPhone = true; // Set to true to enable display on mobile, false to hide it 

## Important notes:

- Click on the time display to switch beetween UTC, Local Time and UTC & Local Time
- A switch in the header of the script can be used to toggle the time display on mobile devices on and off
