(() => {
    ////////////////////////////////////////////////////////////
    ///                                                      ///
    ///  TIME DISPLAY SCRIPT FOR FM-DX-WEBSERVER (V2.5)      ///
    ///                                                      ///
    ///  by Highpoint                last update: 12.11.24   ///
    ///                                                      ///
    ///  https://github.com/Highpoint2000/webserver-time     ///
	///                                                      ///
    ////////////////////////////////////////////////////////////

    // Configurable options
    let showTimeOnPhone = true;
    let showDate = true;

    ////////////////////////////////////////////////////////////

    const plugin_version = '2.5';
    let initialDisplayState = '0';
    let timeDisplayInline = JSON.parse(localStorage.getItem("timeDisplayInline")) ?? true;

    // Fetch coordinates and declare variable for storing server time offset
    const LAT = localStorage.getItem('qthLatitude');
    const LON = localStorage.getItem('qthLongitude');
    let serverTimeOffset = 0; // Offset in hours from UTC

    // Function to load the offset from localStorage or fetch via API
    function loadServerTimeOffset() {
        const savedOffsetKey = `serverTimeOffset_${LAT}_${LON}`;
        const savedOffset = localStorage.getItem(savedOffsetKey);

        if (savedOffset !== null) {
            serverTimeOffset = parseFloat(savedOffset);
            console.log("UTC Offset loaded from localStorage (hours):", serverTimeOffset);

        } else {
            fetchUtcOffset(savedOffsetKey);
        }
    }

    // Fetch UTC offset from GeoNames API and save to localStorage
    function fetchUtcOffset(savedOffsetKey) {
        if (LAT && LON) {
            fetch(`http://api.geonames.org/timezoneJSON?lat=${LAT}&lng=${LON}&username=highpoint`)
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

        const getCurrentServerDate = () => {
            const nowUTC = new Date(); // Current UTC time
            const serverDate = new Date(nowUTC.getTime() - serverTimeOffset * 60 * 60 * 1000); // Apply offset in milliseconds

            return serverDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
        };

        const container = document.createElement("div");
        container.id = "time-toggle-container";
        container.style.position = "absolute";
        container.style.cursor = "pointer";
        container.title = `Plugin Version: ${plugin_version}`;
        
        if (!window.location.href.includes("setup")) {
            container.style.zIndex = "1";
        }

        const wrapperElement = document.getElementById("wrapper-outer");
        if (wrapperElement) {
            wrapperElement.prepend(container);
        } else {
            console.error("Element with id #wrapper not found.");
        }

        const savedPosition = JSON.parse(localStorage.getItem('timeDisplayPosition'));

        if (window.innerWidth >= 930) {
            if (!savedPosition) {
                container.style.left = "50%";
                container.style.transform = "translateX(-50%)";
                container.style.top = "10%";
                container.style.width = "auto";
                localStorage.setItem("timeDisplayPosition", JSON.stringify({ x: container.offsetLeft, y: container.offsetTop }));
            } else {
                container.style.left = `${savedPosition.x}px`;
                container.style.top = `${savedPosition.y}px`;
            }
        } else {
            container.style.left = "50%";
            container.style.transform = "translateX(-48%)";
            container.style.top = "70px";
            container.style.width = "400px";
        }    

        let fontSizeTime = JSON.parse(localStorage.getItem("fontSizeTime")) ?? 28;

        function updateFontSizes() {
            let adjustedFontSizeTime = window.innerWidth <= 768 ? fontSizeTime * 0.9 : fontSizeTime;
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
            fontSizeTime += event.deltaY < 0 ? 2 : -2;
            updateFontSizes();
            localStorage.setItem("fontSizeTime", JSON.stringify(fontSizeTime));
        });

        let isDragging = false;
        let wasDragged = false;
        let startX, startY, initialX, initialY;

        container.addEventListener("mousedown", (event) => {
            isDragging = true;
            wasDragged = false;
            startX = event.clientX;
            startY = event.clientY;
            initialX = container.offsetLeft;
            initialY = container.offsetTop;
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                const dx = event.clientX - startX;
                const dy = event.clientY - startY;
                container.style.left = `${initialX + dx}px`;
                container.style.top = `${initialY + dy}px`;
                wasDragged = true;
            }
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                localStorage.setItem("timeDisplayPosition", JSON.stringify({ x: container.offsetLeft, y: container.offsetTop }));
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
                container.innerHTML = LocalTimeContainerHtml("LOCAL TIME", getCurrentTime(), showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;">${getCurrentLocalDate()}</div>` : '');
            } else if (displayState === 5) {
                container.innerHTML = WorldTimeContainerHtml("WORLD TIME", getCurrentUTCTime(), showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;">${getCurrentWorldDate()}</div>` : '');
            } else if (displayState === 6) {
                container.innerHTML = ServerTimeContainerHtml("SERVER TIME", getServerTime(), showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;">${getCurrentServerDate()}</div>` : '');
            }
            updateFontSizes();
        };
		
        const localDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px; font-size: ${fontSizeTime / 6}px;" id="local-date">${getCurrentLocalDate()}</div>` : '';
        const WorldDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px; font-size: ${fontSizeTime / 6}px;" id="world-date">${getCurrentWorldDate()}</div>` : '';
        const serverDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px; font-size: ${fontSizeTime / 6}px;" id="server-date">${getCurrentServerDate()}</div>` : '';

        const WorldLocalContainerHtml = () => {
            
            if (timeDisplayInline) {
                return `
                    <div id="time-content" style="display: flex; align-items: center; justify-content: center;">
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
                    <div id="time-content" style="display: flex; align-items: center; justify-content: center;">
                        <div id="utc-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-world-time">${getCurrentUTCTime()}</div>
                            ${WorldDateHtml}
                        </div>
                        <div id="server-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME</h2>
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
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-server-time">${getServerTime()}</div>
                            ${serverDateHtml}
                        </div>
                    </div>`;
            }
			
		};	
	
		const LocalServerContainerHtml = () => {
			
		if (timeDisplayInline) {
            return `
                    <div id="time-content" style="display: flex; align-items: center; justify-content: center;">
                        <div id="local-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-local-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                        <div id="server-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME</h2>
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
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-server-time">${getServerTime()}</div>
                            ${serverDateHtml}
                        </div>
                    </div>`;
            }
			
		};
		
		const LocalServerWorldContainerHtml = () => {
			
			if (timeDisplayInline) {
                return `
                    <div id="time-content" style="display: flex; align-items: center; justify-content: center;">
                        <div id="local-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-local-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                        <div id="server-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME</h2>
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
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="server-label">SERVER TIME</h2>
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
                    <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px; text-align: center;" id="single-label" class="mb-0">SERVER TIME</h2>
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
                const brCount = (window.innerWidth <= 768 && !timeDisplayInline) ? 7 : 4;
                const brTags = "<br>".repeat(brCount);
                tunerInfoPanel.insertAdjacentHTML("beforebegin", brTags);
            }
        }

        updateTunerInfoSpacing();
        window.addEventListener("resize", updateTunerInfoSpacing);
    }

    loadServerTimeOffset();
	
	setTimeout(() => {
		initializeTimeDisplay();
	}, 100);

})();