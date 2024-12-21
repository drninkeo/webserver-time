# Time Display Plugin Extended for [FM-DX-Webserver](https://github.com/NoobishSVK/fm-dx-webserver)

This plugin provides a time display (UTC/LOCAL/SERVER) for the FM-DX web server. Now with DST and manual time offset overrides.

[Forked from Highpoint2000's orignal version](https://github.com/Highpoint2000/webserver-time)

![image](https://github.com/user-attachments/assets/4a694417-5e76-490b-aaf7-26792de6d9d7)


## Version 2.6a
- Fixed a bug where if the client is located in a day in the future (eg. Tuesday) and the server is behind (eg. Monday), then both times are displayed wrong.
- Added a check for detecting mobile mode, and not adding the container at all if time is not to be shown on mobile (showTimeOnPhone is set to false)
## Installation notes:

1. [Download](https://github.com/drninkeo/webserver-time/releases) the last repository as a zip
2. Unpack all files from the plugins folder to ..fm-dx-webserver-main\plugins\ 
3. Stop or close the fm-dx-webserver
4. Start/Restart the fm-dx-webserver with "npm run webserver" on node.js console, check the console informations
5. Activate the Screenshot plugin in the settings
6. Stop or close the fm-dx-webserver
7. Start/Restart the fm-dx-webserver with "npm run webserver" on node.js console, check the console informations

## Configuration options:

The following variables can be changed in the header of timedisplay.js:

    showTimeOnPhone = false;		// Set to true to enable display on mobile, false to hide it 
    showDate = true;			// true to show the date, false to hide it  
	updateInfo = true; 			// Enable or disable the daily plugin update check for admin
	forceManualTime = true;		// Enables forcing a manually specified time offset, set below
	manualUtcOffset = 10.0;
	isDstPeriod = true;			// Set to true if the server is located in a DST observant region, and DST is currently in use.
	timeStringDisplay = "AEDT"; // Server region display.

> [!TIP]
> - Move the time display to an individual position using drag and drop (mouse button on time display!) <br><br>
> - Click on the time display to switch between UTC, local time and server time and the different display options <br><br>
> - The size of the time display can be changed variably using the scroll wheel <br><br>
> - Switching the arrangement (vertical or horizontal) is done by holding down the time display (2.5 seconds!) <br><br>
> - A switch in the script header can be used to turn the time display on mobile devices and the date on and off <br><br>
> - When you log in as admin, an update check occurs <br><br>

## History:

## Version 2.6
- Adjusted to default on the left-hand side, outside of the main wrapper.
- Added manual time offset adjustments for when the server is ran on HTTPS.
- Added time display option for the server time.

### Version 2.5e
- Adjustments for screenshot creation

### Version 2.5d

- Code adjustments
- Make sure the position is maintained when changing the window size
- Scroll limits built in

### Version 2.5c

- Daily update check for admin

### Version 2.5b

- Fixed display on mobile devices
- Adding a toast notification to the operation on first access
- Minor code corrections

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
