setTimeout(() => {
    ////////////////////////////////////////////////////////////
    ///                                                      ///
    ///  TIME DISPLAY SCRIPT FOR FM-DX-WEBSERVER (V2.4)      ///
    ///                                                      ///
    ///  by Highpoint                last update: 10.11.24   ///
    ///                                                      ///
    ///  https://github.com/Highpoint2000/webserver-time     ///
    ///                                                      ///
    ////////////////////////////////////////////////////////////
	
    // Configurable options
    let showTimeOnPhone = true;
    let showDate = true;
	
    ////////////////////////////////////////////////////////////

    const plugin_version = '2.4';
    let initialDisplayState = '0';
    let timeDisplayInline = JSON.parse(localStorage.getItem("timeDisplayInline")) ?? true; // Load from localStorage or default to true

    function initializeTimeDisplay() {
        const phoneDisplayClass = showTimeOnPhone ? 'show-phone' : 'hide-phone';
        let displayState = localStorage.getItem('displayState');
        
        if (displayState === null) {
            displayState = parseInt(initialDisplayState, 10);
            localStorage.setItem('displayState', displayState);
        } else {
            displayState = parseInt(displayState, 10);
        }

        const getCurrentTime = () => new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const getCurrentUTCTime = () => new Date().toUTCString().split(' ')[4];
        const getCurrentLocalDate = () => new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
        
        const getCurrentUTCDate = () => {
            const now = new Date();
            const utcDay = now.getUTCDate().toString().padStart(2, '0');
            const utcMonth = now.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
            const utcYear = now.getUTCFullYear();
            const utcWeekday = now.toLocaleString('en-GB', { weekday: 'short', timeZone: 'UTC' });
            return `${utcWeekday}, ${utcDay} ${utcMonth} ${utcYear}`;
        };

        const getFontLabel = () => (window.innerHeight >= 860 ? '18px' : '14px');
        const getFontSizeTime = () => (window.innerHeight >= 860 ? '36px' : '30px');
        const getFontSizeMarginDouble = () => (window.innerHeight >= 860 && window.innerWidth >= 930 ? '-15px' : window.innerWidth <= 768 ? '-13px' : '-10px');

        const DoubleTimeContainerHtml = () => {
            const utcDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;" id="utc-date">${getCurrentUTCDate()}</div>` : '';
            const localDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;" id="local-date">${getCurrentLocalDate()}</div>` : '';
            
            if (timeDisplayInline) {
                return `
                    <div id="time-content" style="display: flex; align-items: center; justify-content: center;">
                        <div id="utc-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${getFontLabel()};" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="font-size: ${getFontSizeTime()}; margin: ${getFontSizeMarginDouble()} 0 0 0;" id="current-utc-time">${getCurrentUTCTime()}</div>
                            ${utcDateHtml}
                        </div>
                        <div id="local-container" style="text-align: center; margin-right: 20px;">                           
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${getFontLabel()};" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text-left" style="font-size: ${getFontSizeTime()}; margin: ${getFontSizeMarginDouble()} 0 0 0;" id="current-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                    </div>`;
            } else {
                return `
                    <div id="time-content" style="text-align: center;">
                        <div id="utc-container">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${getFontLabel()};" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="font-size: ${getFontSizeTime()}; margin-top: ${getFontSizeMarginDouble()}; margin-left: 0; margin-right: 0; margin-bottom: 0;" id="current-utc-time">${getCurrentUTCTime()}</div>
                            ${utcDateHtml}
                        </div>
                        <div id="local-container" style="margin-top: 10px;">
                            <h2 class="${phoneDisplayClass}" style="margin: 0px; font-size: ${getFontLabel()};" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="font-size: ${getFontSizeTime()}; margin-top: ${getFontSizeMarginDouble()};" id="current-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                    </div>`;
            }
        };

        const SingleTimeContainerHtml = (timeLabel, timeValue, dateHtml) => {
            return `
                <div id="time-content" style="text-align: center;">
                    <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${getFontLabel()}; text-align: center;" id="single-label" class="mb-0">${timeLabel}</h2>
                    <div class="${phoneDisplayClass} text" style="font-size: ${getFontSizeTime()}; margin-top: ${getFontSizeMarginDouble()};" id="current-single-time">${timeValue}</div>
                    ${dateHtml}
                </div>`;
        };

        const container = document.createElement("div");
        container.id = "time-toggle-container";
        container.style.position = "absolute";
        container.style.cursor = "pointer";
		container.style.width = "300px";
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

        // Set default position if no saved position is available
		if (window.innerWidth >= 930) {
			if (!savedPosition) {
				if (!document.querySelector(".panel-100.no-bg.tuner-info")) {
					container.style.left = "50%";
					container.style.transform = "translateX(-50%)";
					container.style.top = "10%";
				} else {
					container.style.left = "20px";
					container.style.top = "40px";
				}
			} else {
				container.style.left = `${savedPosition.x}px`;
				container.style.top = `${savedPosition.y}px`;
			}
		} else {
			container.style.left = "50%";
			container.style.transform = "translateX(-48%)";
			container.style.top = "60px";
		}	

        let isDragging = false;
        let isLongPress = false;
        let wasDragged = false;
        let startX, startY, initialX, initialY;
        let longPressTimeout;

        // Long press functionality for toggling timeDisplayInline
        container.addEventListener("mousedown", (event) => {
            if (window.innerWidth >= 930) {
                wasDragged = false;
                startX = event.clientX;
                startY = event.clientY;
                initialX = container.offsetLeft;
                initialY = container.offsetTop;

                longPressTimeout = setTimeout(() => {
                    if (!wasDragged) { // Only toggle if no drag movement occurred
                        isLongPress = true;
                        timeDisplayInline = !timeDisplayInline;
                        localStorage.setItem("timeDisplayInline", JSON.stringify(timeDisplayInline)); // Save to localStorage as JSON
                        setDisplay();
                        console.log("timeDisplayInline toggled:", timeDisplayInline);
                    }
                }, 1000); // Trigger long press action after 1000ms (1 second)
            }
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                const dx = event.clientX - startX;
                const dy = event.clientY - startY;
                const newLeft = Math.min(Math.max(0, initialX + dx), wrapperElement.offsetWidth - container.offsetWidth);
                const newTop = Math.min(Math.max(0, initialY + dy), wrapperElement.offsetHeight - container.offsetHeight);

                container.style.left = `${newLeft}px`;
                container.style.top = `${newTop}px`;
            } else if (startX !== undefined && startY !== undefined) {
                const dx = Math.abs(event.clientX - startX);
                const dy = Math.abs(event.clientY - startY);
                if (dx > 5 || dy > 5) {
                    wasDragged = true; // Set flag to indicate dragging occurred
                    isDragging = true; // Start dragging if movement is detected
                    clearTimeout(longPressTimeout); // Cancel long press if dragging
                }
            }
        });

        document.addEventListener("mouseup", () => {
            if (window.innerWidth >= 930 && isDragging) {
                localStorage.setItem("timeDisplayPosition", JSON.stringify({ x: container.offsetLeft, y: container.offsetTop }));
            }
            clearTimeout(longPressTimeout);
            startX = undefined;
            startY = undefined;
            isDragging = false;
            isLongPress = false;
        });

        // Handle click for toggling display state
        container.addEventListener('click', (event) => {
            if (!wasDragged && !isLongPress) {
                displayState = (displayState + 1) % 3;
                localStorage.setItem('displayState', displayState);
                setDisplay();
            }
            // Reset flags after handling click
            wasDragged = false;
            isLongPress = false;
        });

        const setDisplay = () => {
            if (displayState === 0) {
                container.innerHTML = DoubleTimeContainerHtml();
            } else if (displayState === 1) {
                container.innerHTML = SingleTimeContainerHtml("LOCAL TIME", getCurrentTime(), showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;">${getCurrentLocalDate()}</div>` : '');
            } else {
                container.innerHTML = SingleTimeContainerHtml("WORLD TIME", getCurrentUTCTime(), showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;">${getCurrentUTCDate()}</div>` : '');
            }
        };

        setDisplay();

        const updateTime = () => {
            const currentTimeElement = document.getElementById("current-time");
            const currentUtcTimeElement = document.getElementById("current-utc-time");
            if (currentTimeElement) currentTimeElement.textContent = getCurrentTime();
            if (currentUtcTimeElement) currentUtcTimeElement.textContent = getCurrentUTCTime();

            const singleTimeElement = document.getElementById("current-single-time");
            if (singleTimeElement) singleTimeElement.textContent = displayState === 1 ? getCurrentTime() : getCurrentUTCTime();
            
            const localDateElement = document.getElementById("local-date");
            if (localDateElement) localDateElement.textContent = getCurrentLocalDate();
            
            const utcDateElement = document.getElementById("utc-date");
            if (utcDateElement) utcDateElement.textContent = getCurrentUTCDate();
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
initializeTimeDisplay();
}, 100); // Delay execution by 100ms
