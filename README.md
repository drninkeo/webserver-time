# Time Display Plugin for [FM-DX-Webserver](https://github.com/NoobishSVK/fm-dx-webserver)

This plugin provides a time display (UTC/LOCAL) for the FM-DX web server.


![image](https://github.com/user-attachments/assets/8ed6968d-890c-4d4e-a9de-df070edfab9b)



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

    showTimeOnPhone = true;         // Set to true to enable display on mobile, false to hide it 
    VerticalCorrection = '0'; 	// Pixel value for vertical correction of the time display (e.g., 80, -100 / default = 0)
    HorizontalCorrection = '0'; 	// Pixel value for horizontal correction of the time display (e.g., 50, -60 / default = 0)

## Important notes:

- A switch in the header of the script can be used to toggle the time display on mobile devices on and off
- Move the time display to an individual position using variables in the header
- Click on the time display to switch beetween UTC, Local Time and UTC & Local Time

## History:

### Version 2.0

- Time display has been moved to the header area
- Individual position correction added to the header

### Version 1.0a

- Design adjustments

### Version 1.0

- UTC and Local Time supportet (Click on the time display to switch)
- Switch for time display on mobile devices (located in the header of the script)
