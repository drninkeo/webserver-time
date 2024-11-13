# Time Display Plugin for [FM-DX-Webserver](https://github.com/NoobishSVK/fm-dx-webserver)

This plugin provides a time display (UTC/LOCAL/SERVER) for the FM-DX web server.

![image](https://github.com/user-attachments/assets/d6cd9b28-3afc-4acc-ac71-d799830b5322)

![image](https://github.com/user-attachments/assets/d0ede0a8-2223-4b68-9b79-47ec3eba4e09)

## Version 2.5b

- Fixed display on mobile devices
- Adding a toast notification to the operation on first access
- Minor code corrections

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
    showDate = true;                      	// true to show the date, false to hide it

## Important notes:

- Move the time display to an individual position using drag and drop (mouse button on time display!)
- Click on the time display to switch between UTC, local time and server time and the different display options
- The size of the time display can be changed variably using the scroll wheel
- Switching the arrangement (vertical or horizontal) is done by holding down the time display (2.5 seconds!)
- A switch in the script header can be used to turn the time display on mobile devices and the date on and off





## History:

### Version 2.5a

- Position optimizations

### Version 2.5

- Added server time and more display options (local + server / world + server / local + server + world)

### Version 2.4

- Removed json.config (is no longer needed due to the few settings - see configuration options)
- Switching the arrangement (vertical or horizontal) is now done by holding down the time display (2.5 seconds!)
- The size of the time display can be changed variably using the scroll wheel

### Version 2.3

- fixed position removed and drag and drop effect added (by long pressing the mouse button)
- Layout adjustments (mobile + desktop)
- UTC date problem fixed 

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
