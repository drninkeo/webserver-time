# Time Display Plugin for [FM-DX-Webserver](https://github.com/NoobishSVK/fm-dx-webserver)

This plugin provides a time display (UTC/LOCAL) for the FM-DX web server.


![image](https://github.com/user-attachments/assets/ecff5eed-acdd-4343-bcce-2049ba88a642)

### Version 2.3

- fixed position removed and drag and drop effect added (by long pressing the mouse button)
- Layout adjustments (mobile + desktop)

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

    showTimeOnPhone = true;        		// Set to true to enable display on mobile, false to hide it 
	initialDisplayState = '0';   	 	// 0 for both, 1 for local time only, 2 for UTC only (default display on first load)
    timeDisplayInline = true;      		// true to display times side-by-side, false to display them stacked vertically
    showDate = true;                      	// true to show the date, false to hide it

## Important notes:

- Click on the time display to switch beetween UTC, Local Time and UTC & Local Time
- A switch in the json.config can be used to toggle the time display on mobile devices on and off
- Move the time display to an individual position using drag and drop (long pressing the mouse button on time display!)
- In the json.config you can switch on/off the date display, specify which type of display is loaded the first time it is called and whether the time displays should be one below the other or next to each other

![image](https://github.com/user-attachments/assets/766b7de0-d0ed-484a-85c6-c899e85fbd03)



## History:

### Version 2.2

- Added date display option

### Version 2.1

- Saving the configuration in a JSON file
- Added side-by-side arrangement of time displays
- Determination of the display when called up for the first time

### Version 2.0

- Time display has been moved to the header area
- Individual position correction added to the header

### Version 1.0a

- Design adjustments

### Version 1.0

- UTC and Local Time supportet (Click on the time display to switch)
- Switch for time display on mobile devices (located in the header of the script)
