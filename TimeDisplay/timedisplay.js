(() => {
    ////////////////////////////////////////////////////////////
    ///                                                      ///
    ///  TIME DISPLAY SCRIPT FOR FM-DX-WEBSERVER (V2.6a)     ///
    ///                                                      ///
    ///  by Highpoint                last update: 19.11.24   ///
	///  Modified by ninkeon58 - 21/12/2024					 ///
    ///                                                      ///
    ///  https://github.com/Highpoint2000/webserver-time     ///
	///  https://github.com/drninkeo/webserver-time			 ///
	///														 ///
    ////////////////////////////////////////////////////////////

    // Configurable options
    let showTimeOnPhone = true;		// Set to true to enable display on mobile, false to hide it 
    let showDate = true;			// true to show the date, false to hide it  
	let updateInfo = true; 			// Enable or disable the daily plugin update check for admin
	let forceManualTime = true;		// Enables forcing a manually specified time offset, set below
	let manualUtcOffset = 10.0;
	let isDstPeriod = true;			// Set to true if the server is located in a DST observant region, and DST is currently in use.
	let timeStringDisplay = "AEDT"; // Time offset display for local region.

    ////////////////////////////////////////////////////////////

    const plugin_version = '2.6a';
	const ipApiUrl = 'https://api.ipify.org?format=json';
	const corsAnywhereUrl = 'https://cors-proxy.de:13128/';													
	
    let initialDisplayState = '0';
    let timeDisplayInline = JSON.parse(localStorage.getItem("timeDisplayInline")) ?? true;
	let isTuneAuthenticated;
	let IPadress;

	async function fetchIp() {
		try {
			const ipApiUrl = 'https://api.ipify.org?format=json';
			const response = await fetch(ipApiUrl);
			const data = await response.json();
			IPadress = data.ip;
			// console.log('Your IP address is:', IPadress); // IP-Adresse hier verfügbar
		} catch (error) {
			console.error('Error fetching your IP address:', error);
		}
	}

	fetchIp();
	
	// Define local version and Github settings
	const plugin_path = 'https://raw.githubusercontent.com/highpoint2000/webserver-time/';
	const plugin_JSfile = 'main/TimeDisplay/timedisplay.js'
	const plugin_name = 'Time Display';
	
	if (window.innerWidth >= 920) {
	
		// Check if required localStorage items are present
		const timedisplaytoastinfo = localStorage.getItem("timedisplaytoastinfo");
		setTimeout(() => {
			if (timedisplaytoastinfo === null && IPadress !== '89.58.28.164') {
				sendToast('info important', 'Time Display', `Use drag & drop to move the time display to the desired position, change the time selection (UTC, LOCAL and/or WORLD TIME) by briefly clicking on it, hold down the display to change the design (horizontal or vertical) and use the mouse wheel to change the time display to adjust the correct size..`, true, false);
				localStorage.setItem("timedisplaytoastinfo", true);
			}
		}, 1000);
	}

    // Fetch coordinates and declare variable for storing server time offset
    const LAT = localStorage.getItem('qthLatitude');
    const LON = localStorage.getItem('qthLongitude');
    let serverTimeOffset = 0; // Offset in hours from UTC

    // Function to load the offset from localStorage or fetch via API
    function loadServerTimeOffset() {
        const savedOffsetKey = `serverTimeOffset_${LAT}_${LON}`;
        const savedOffset = localStorage.getItem(savedOffsetKey);

		if(forceManualTime == false){
			if (savedOffset !== null) {
				serverTimeOffset = parseFloat(savedOffset);
				console.log("UTC Offset loaded from localStorage (hours):", serverTimeOffset);

			} else {
				fetchUtcOffset(savedOffsetKey);
			}
		}else{
			if(isDstPeriod == false){
				serverTimeOffset = parseFloat(manualUtcOffset);
			}else{
				serverTimeOffset = parseFloat(manualUtcOffset + 1);
			}
		}
    }

    // Fetch UTC offset from GeoNames API and save to localStorage
    function fetchUtcOffset(savedOffsetKey) {
		if(forceManualTime == false){
			console.log("Attempting to fetch database time");
			if (LAT && LON) {
				fetch(`${corsAnywhereUrl}http://api.geonames.org/timezoneJSON?lat=${LAT}&lng=${LON}&username=highpoint`)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        serverTimeOffset = data.rawOffset;
                        localStorage.setItem(savedOffsetKey, serverTimeOffset);
                        console.log("UTC Offset fetched and saved (hours):", serverTimeOffset);
                    }
                })
                .catch(error => console.error("Error fetching the UTC Offset:", error));
			}	
		}else{
			if(isDstPeriod == false){
				serverTimeOffset = parseFloat(manualUtcOffset);
			}else{
				serverTimeOffset = parseFloat(manualUtcOffset + 1);
			}
		}
    }

	function adjustForTimezone(dtInput){
		var targetTime = new Date(dtInput);
		var timeZoneFromDB = serverTimeOffset; //time zone value from our server declared value
		
		//get the timezone offset from local time in minutes
		var tzDifference = timeZoneFromDB * 60 + targetTime.getTimezoneOffset();
		
		//convert the offset to milliseconds, add to targetTime, and make a new Date
		var offsetTime = new Date(targetTime.getTime() + tzDifference * 60 * 1000);
		return offsetTime;
	}
	
    function initializeTimeDisplay() {
        const phoneDisplayClass = showTimeOnPhone ? 'show-phone' : 'hide-phone';
        let displayState = localStorage.getItem('displayState');
        
        if (displayState === null) {
            displayState = parseInt(initialDisplayState, 10);
            localStorage.setItem('displayState', displayState);
        } else {
            displayState = parseInt(displayState, 10);
        }

        const getCurrentTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const getCurrentUTCTime = () => new Date().toUTCString().split(' ')[4];
        const getCurrentLocalDate = () => new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

        
        const getCurrentWorldDate = () => {
            const now = new Date();
            const utcDay = now.getUTCDate().toString().padStart(2, '0');
            const utcMonth = now.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
            const utcYear = now.getUTCFullYear();
            const utcWeekday = now.toLocaleString('en-GB', { weekday: 'short', timeZone: 'UTC' });
            return `${utcWeekday}, ${utcDay} ${utcMonth} ${utcYear}`;
        };

		const getServerTime = () => {
			const now = new Date(); // Aktuelles Datum und Uhrzeit
			const utcNow = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()); // Konvertiert das lokale Datum in UTC
			const serverTime = new Date(utcNow.getTime() + serverTimeOffset * 60 * 60 * 1000); // Wendet den Offset in Millisekunden an
			return serverTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
		};
		
		const getTimeDisplayString = () => {
			return timeStringDisplay;
		}

        const getCurrentServerDate = () => {
			// First get the time in UTC
			var date = new Date();
            const nowUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds());
				
			// Get the adjusted timezone as the server may be in a different day (eg, Tuesday while the client is still in Monday)
            const serverDate = new Date(adjustForTimezone(nowUTC));
			
            return serverDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
        };
		
        const container = document.createElement("div");
        container.id = "time-toggle-container";
        container.style.position = "relative";
        container.style.cursor = "pointer";
        container.title = `Plugin Version: ${plugin_version}`;
        
        if (!window.location.href.includes("setup")) {
            container.style.zIndex = "1";
        }
		
		var isPhoneDontAdd;

        var wrapperElement = document.getElementById("wrapper-outer");
		if (window.innerWidth < 1500) {
			wrapperElement = document.getElementById("wrapper");
			if(showTimeOnPhone == false){
				isPhoneDontAdd = true;
			}
		}else{
			container.style.height = "100%";
			container.style.top = "115px";	
		}
		
        if (wrapperElement) {
			if (window.innerWidth > 768) {
				wrapperElement.prepend(container);
			}else{
				if(isPhoneDontAdd == false){
					wrapperElement.prepend(container);
				}
			}
        } else {
            console.error("Element with id #wrapper not found.");
        }

        const savedPosition = JSON.parse(localStorage.getItem('timeDisplayPosition'));

        if (window.innerWidth >= 930) {
            if (!savedPosition) {
				let tunerInfoPanel = document.querySelector('.panel-100.no-bg.tuner-info');
				if (tunerInfoPanel) {
					if (window.innerHeight <= 860) {
						container.style.left = "0px";		
					} else {
						container.style.left = "-75px";
					}
				} else {
					if (window.innerHeight <= 860) {
						container.style.left = "-4px";		
					} else {
						container.style.left = "0px";
					}
				}		
                container.style.width = "auto";
            } else {
                container.style.left = `${savedPosition.x}px`;
                container.style.top = `${savedPosition.y}px`;
            }
        } else {
            container.style.left = "50%";
            container.style.transform = "translateX(-47.5%)";
            container.style.top = "20px";
            container.style.width = "340px";
        }    

        let fontSizeTime = JSON.parse(localStorage.getItem("fontSizeTime")) ?? 28;

        function updateFontSizes() {
            let adjustedFontSizeTime = window.innerWidth <= 768 && displayState === 3 ? fontSizeTime * 0.75 : fontSizeTime;

            let adjustedFontLabelSize = adjustedFontSizeTime / 2;
            let adjustedFontDateSize = (adjustedFontSizeTime / 1.5) - 3;

            const timeElements = container.querySelectorAll(".text");
            timeElements.forEach(el => el.style.fontSize = `${adjustedFontSizeTime}px`);

            const labelElements = container.querySelectorAll("h2");
            labelElements.forEach(el => el.style.fontSize = `${adjustedFontLabelSize}px`);

            const dateElements = container.querySelectorAll(".date-display");
            dateElements.forEach(el => el.style.fontSize = `${adjustedFontDateSize}px`);
        }

container.addEventListener("wheel", (event) => {
    event.preventDefault();

    // Adjust font size based on wheel direction
    if (event.deltaY < 0) {
        // Increase font size, but not above 20
        fontSizeTime = Math.min(fontSizeTime + 2, 35);
    } else {
        // Decrease font size, but not below 5
        fontSizeTime = Math.max(fontSizeTime - 2, 20);
    }

    // Update font sizes based on the new fontSizeTime
    updateFontSizes();

    // Store the current font size in localStorage
    localStorage.setItem("fontSizeTime", JSON.stringify(fontSizeTime));
});


        let isDragging = false;
        let wasDragged = false;
        let startX, startY, initialX, initialY;

		// Beim Laden der Seite die Position aus localStorage setzen
		window.addEventListener('load', () => {
			const savedPosition = JSON.parse(localStorage.getItem("timeDisplayPosition"));
			if (savedPosition) {
				container.style.left = `${savedPosition.x}px`;
				container.style.top = `${savedPosition.y}px`;
			}
		});

		container.addEventListener("mousedown", (event) => {
			isDragging = true;
			wasDragged = false;

			// Berechne den Startpunkt der Maus
			startX = event.clientX;
			startY = event.clientY;

			// Berechne die aktuelle Position des Containers
			initialX = parseInt(container.style.left || 0, 10); // Default 0, falls keine Position gesetzt wurde
			initialY = parseInt(container.style.top || 0, 10);  // Default 0, falls keine Position gesetzt wurde
		});

		document.addEventListener("mousemove", (event) => {
			if (isDragging) {
				const dx = event.clientX - startX;
				const dy = event.clientY - startY;

				// Setze die neue Position des Containers
				container.style.left = `${initialX + dx}px`;
				container.style.top = `${initialY + dy}px`;

				wasDragged = true;
			}
		});

		document.addEventListener("mouseup", () => {
			if (isDragging) {
				// Speichere die Position nach dem Loslassen der Maus
				const newPosition = {
					x: parseInt(container.style.left, 10),
					y: parseInt(container.style.top, 10)
				};
				localStorage.setItem("timeDisplayPosition", JSON.stringify(newPosition));
				isDragging = false;
			}
		});


        let isLongPress = false;
        let longPressTimeout;

        container.addEventListener("mousedown", () => {
            longPressTimeout = setTimeout(() => {
                isLongPress = true;
                timeDisplayInline = !timeDisplayInline;
                localStorage.setItem("timeDisplayInline", JSON.stringify(timeDisplayInline));
                setDisplay();
                console.log("timeDisplayInline toggled:", timeDisplayInline);
            }, 2500);
        });

        container.addEventListener("mouseup", () => {
            clearTimeout(longPressTimeout);
            isLongPress = false;
        });

        container.addEventListener("click", () => {
            if (!isLongPress && !wasDragged) {
                displayState = (displayState + 1) % 7;
                localStorage.setItem("displayState", displayState);
                setDisplay();
            }
        });

        const setDisplay = () => {
            if (displayState === 0) {
                container.innerHTML = WorldLocalContainerHtml();
            } else if (displayState === 1) {	
                container.innerHTML = WorldServerContainerHtml();		
            } else if (displayState === 2) {
                container.innerHTML = LocalServerContainerHtml();
            } else if (displayState === 3) {
                container.innerHTML = LocalServerWorldContainerHtml();
            } else if (displayState === 4) {							 
                container.innerHTML = LocalTimeContainerHtml();
            } else if (displayState === 5) {
                container.innerHTML = WorldTimeContainerHtml();
            } else if (displayState === 6) {
                container.innerHTML = ServerTimeContainerHtml();
            }
            updateFontSizes();
        };
		
        const localDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px; font-size: ${fontSizeTime / 6}px; padding-bottom: 20px;" id="local-date">${getCurrentLocalDate()}</div>` : '<div style="min-width: 100px; display:inline-block;"></div>';
		const WorldDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px; font-size: ${fontSizeTime / 6}px; padding-bottom: 20px;" id="world-date">${getCurrentWorldDate()}</div>` : '<div style="min-width: 100px; display:inline-block;"></div>';
        const serverDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px; font-size: ${fontSizeTime / 6}px; padding-bottom: 20px;" id="server-date">${getCurrentServerDate()}</div>` : '<div style="min-width: 100px; display:inline-block;"></div>';

        const WorldLocalContainerHtml = () => {
            
            if (timeDisplayInline) {
                return `
                    <div id="time-content" style="display: block; align-items: center; justify-content: center;">
                        <div id="utc-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-world-time">${getCurrentUTCTime()}</div>
                            ${WorldDateHtml}
                        </div>
                        <div id="local-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-local-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                    </div>`;
            } else {
                return `
                    <div id="time-content" style="text-align: center;">
                        <div id="utc-container">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-world-time">${getCurrentUTCTime()}</div>
                            ${WorldDateHtml}
                        </div>
                        <div id="local-container" style="margin-top: 30px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-local-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                    </div>`;
            }
			
		};
			
		const WorldServerContainerHtml = () => {
			
			if (timeDisplayInline) {
                return `
                    <div id="time-content" style="display: block; align-items: center; justify-content: center;">
                        <div id="utc-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-world-time">${getCurrentUTCTime()}</div>
                            ${WorldDateHtml}
                        </div>
                        <div id="server-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME (${getTimeDisplayString()})</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-server-time">${getServerTime()}</div>
                            ${serverDateHtml}
                        </div>
                    </div>`;
            } else {
                return `
                    <div id="time-content" style="text-align: center;">
                        <div id="utc-container">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-world-time">${getCurrentUTCTime()}</div>
                            ${WorldDateHtml}
                        </div>
                        <div id="server-container" style="margin-top: 30px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME (${getTimeDisplayString()})</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-server-time">${getServerTime()}</div>
                            ${serverDateHtml}
                        </div>
                    </div>`;
            }
			
		};	
	
		const LocalServerContainerHtml = () => {
			
		if (timeDisplayInline) {
            return `
                    <div id="time-content" style="display: block; align-items: center; justify-content: center;">
                        <div id="local-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-local-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                        <div id="server-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME (${getTimeDisplayString()})</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-server-time">${getServerTime()}</div>
                            ${serverDateHtml}
                        </div>
                    </div>`;
            } else {
                return `
                    <div id="time-content" style="text-align: center;">
                        <div id="local-container">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-local-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                        <div id="server-container" style="margin-top: 30px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME (${getTimeDisplayString()})</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-server-time">${getServerTime()}</div>
                            ${serverDateHtml}
                        </div>
                    </div>`;
            }
			
		};
		
		const LocalServerWorldContainerHtml = () => {
			
			if (timeDisplayInline) {
                return `
                    <div id="time-content" style="display: block; align-items: center; justify-content: center;">
                        <div id="local-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-local-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                        <div id="server-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME (${getTimeDisplayString()})</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-server-time">${getServerTime()}</div>
                            ${serverDateHtml}
                        </div>
						    <div id="utc-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-world-time">${getCurrentUTCTime()}</div>
                            ${WorldDateHtml}
                        </div>
                    </div>`;
            } else {
                return `
                    <div id="time-content" style="text-align: center;">
                        <div id="local-container">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-local-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                        <div id="server-container" style="margin-top: 30px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME (${getTimeDisplayString()})</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-server-time">${getServerTime()}</div>
                            ${serverDateHtml}
                        </div>
						<div id="utc-container" style="margin-top: 30px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-world-time">${getCurrentUTCTime()}</div>
                            ${WorldDateHtml}
                        </div>
                    </div>`;
            }
			
		};
		
	    const LocalTimeContainerHtml = () => {
            return `
                <div id="time-content" style="text-align: center;">
                    <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px; text-align: center;" id="single-label" class="mb-0">LOCAL TIME</h2>
                    <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-local-time">${getCurrentTime()}</div>
                    ${localDateHtml}
                </div>`;
        };

        const WorldTimeContainerHtml = () => {
            return `
                <div id="time-content" style="text-align: center;">
                    <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px; text-align: center;" id="single-label" class="mb-0">WORLD TIME</h2>
                    <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-world-time">${getCurrentUTCTime()}</div>
                    ${WorldDateHtml}
                </div>`;
        };

        const ServerTimeContainerHtml = () => {
            return `
                <div id="time-content" style="text-align: center;">
                    <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px; text-align: center;" id="single-label" class="mb-0">SERVER TIME (${getTimeDisplayString()})</h2>
                    <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-server-time">${getServerTime()}</div>
                    ${serverDateHtml}
                </div>`;
        };		

        setDisplay();

        const updateTime = () => {
			
            const currentTimeElement = document.getElementById("current-local-time");
            const currentUtcTimeElement = document.getElementById("current-world-time");
			const currentServerTimeElement = document.getElementById("current-server-time");
	
			if (currentTimeElement) currentTimeElement.textContent = getCurrentTime();
            if (currentUtcTimeElement) currentUtcTimeElement.textContent = getCurrentUTCTime();
			if (currentServerTimeElement) currentServerTimeElement.textContent = getServerTime();

            const localDateElement = document.getElementById("local-date");
            if (localDateElement) localDateElement.textContent = getCurrentLocalDate();

            const WorldDateElement = document.getElementById("world-date");
            if (WorldDateElement) WorldDateElement.textContent = getCurrentWorldDate();
            
            const serverDateElement = document.getElementById("server-date");
            if (serverDateElement) serverDateElement.textContent = getCurrentServerDate();
        };

        setInterval(updateTime, 1000);

        const tunerInfoPanel = document.querySelector(".tuner-info");

        function updateTunerInfoSpacing() {
            while (tunerInfoPanel && tunerInfoPanel.previousSibling && tunerInfoPanel.previousSibling.nodeName === "BR") {
                tunerInfoPanel.parentNode.removeChild(tunerInfoPanel.previousSibling);
            }

            if (window.innerWidth < 930 && tunerInfoPanel && showTimeOnPhone) {
                const brCount = (window.innerWidth <= 768 && !timeDisplayInline) ? 7 : 2;
                const brTags = "<br>".repeat(brCount);
                tunerInfoPanel.insertAdjacentHTML("beforebegin", brTags);
            }
        }

        updateTunerInfoSpacing();
        window.addEventListener("resize", updateTunerInfoSpacing);
    }
	 
  const PluginUpdateKey = `${plugin_name}_lastUpdateNotification`; // Unique key for localStorage

 // Function to check if the notification was shown today
  function shouldShowNotification() {
    const lastNotificationDate = localStorage.getItem(PluginUpdateKey);
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    if (lastNotificationDate === today) {
      return false; // Notification already shown today
    }
    // Update the date in localStorage to today
    localStorage.setItem(PluginUpdateKey, today);
    return true;
  }

  // Function to check plugin version
  function checkPluginVersion() {
    // Fetch and evaluate the plugin script
    fetch(`${plugin_path}${plugin_JSfile}`)
      .then(response => response.text())
      .then(script => {
        // Search for plugin_version in the external script
        const pluginVersionMatch = script.match(/const plugin_version = '([\d.]+[a-z]*)?';/);
        if (!pluginVersionMatch) {
          console.error(`${plugin_name}: Plugin version could not be found`);
          return;
        }

        const externalPluginVersion = pluginVersionMatch[1];

        // Function to compare versions
		function compareVersions(local, remote) {
			const parseVersion = (version) =>
				version.split(/(\d+|[a-z]+)/i).filter(Boolean).map((part) => (isNaN(part) ? part : parseInt(part, 10)));

			const localParts = parseVersion(local);
			const remoteParts = parseVersion(remote);

			for (let i = 0; i < Math.max(localParts.length, remoteParts.length); i++) {
				const localPart = localParts[i] || 0; // Default to 0 if part is missing
				const remotePart = remoteParts[i] || 0;

				if (typeof localPart === 'number' && typeof remotePart === 'number') {
					if (localPart > remotePart) return 1;
					if (localPart < remotePart) return -1;
				} else if (typeof localPart === 'string' && typeof remotePart === 'string') {
					// Lexicographical comparison for strings
					if (localPart > remotePart) return 1;
					if (localPart < remotePart) return -1;
				} else {
					// Numeric parts are "less than" string parts (e.g., `3.5` < `3.5a`)
					return typeof localPart === 'number' ? -1 : 1;
				}
			}

			return 0; // Versions are equal
		}


        // Check version and show notification if needed
        const comparisonResult = compareVersions(plugin_version, externalPluginVersion);
        if (comparisonResult === 1) {
          // Local version is newer than the external version
          console.log(`${plugin_name}: The local version is newer than the plugin version.`);
        } else if (comparisonResult === -1) {
          // External version is newer and notification should be shown
          if (shouldShowNotification()) {
            console.log(`${plugin_name}: Plugin update available: ${plugin_version} -> ${externalPluginVersion}`);
			sendToast('warning important', `${plugin_name}`, `Update available:<br>${plugin_version} -> ${externalPluginVersion}`, false, false);
            }
        } else {
          // Versions are the same
          console.log(`${plugin_name}: The local version matches the plugin version.`);
        }
      })
      .catch(error => {
        console.error(`${plugin_name}: Error fetching the plugin script:`, error);
      });
	}

  // Function to check if the user is logged in as an administrator
    function checkAdminMode() {
        const bodyText = document.body.textContent || document.body.innerText;
        let isAdminLoggedIn = bodyText.includes("You are logged in as an administrator.") || bodyText.includes("You are logged in as an adminstrator.");
 
        if (isAdminLoggedIn) {
            console.log(`Admin mode found`);
            isTuneAuthenticated = true;
        } 
    }

	checkAdminMode(); // Check admin mode
    loadServerTimeOffset();

	setTimeout(() => {
		initializeTimeDisplay();
		// Execute the plugin version check if updateInfo is true
		if (updateInfo && isTuneAuthenticated) {
			checkPluginVersion();
			}
		}, 200);

})();
