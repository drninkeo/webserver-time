# Time Display Plugin for [FM-DX-Webserver](https://github.com/NoobishSVK/fm-dx-webserver)

This plugin provides a time display (UTC/LOCAL) for the FM-DX web server.

![image](https://github.com/user-attachments/assets/85d8fb3b-d657-4376-9e06-2168bcff9206)



## Version 2.0a

- 

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

- A switch in the header of the script can be used to toggle the time display on mobile devices on and off
- Click on the time display to switch beetween UTC, Local Time and UTC & Local Time

![image](https://github.com/user-attachments/assets/bfcc70ed-2d5d-4ddc-bc0a-de1c07c9bae5)
![image](https://github.com/user-attachments/assets/39a6c1ed-251c-4686-9ddc-7e34a7da7293)

## History:

### Version 2.0

- Time display has been moved to the header area
- Individual position correction added to the header

### Version 1.0a

- Design adjustments

### Version 1.0

- UTC and Local Time supportet (Click on the time display to switch)
- Switch for time display on mobile devices (located in the header of the script)
