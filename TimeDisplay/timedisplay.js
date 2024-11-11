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

        const getCurrentTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
				if (!document.querySelector(".panel-100.no-bg.tuner-info")) {
					container.style.left = "50%";
					container.style.transform = "translateX(-50%)";
					container.style.top = "10%";
					container.style.width = "auto";
				} else {
					container.style.left = "20px";
					container.style.top = "40px";
					container.style.width = "auto";
				}

				// Initiale Position speichern
				localStorage.setItem("timeDisplayPosition", JSON.stringify({ x: container.offsetLeft, y: container.offsetTop }));
			} else {
				container.style.left = `${savedPosition.x}px`;
				container.style.top = `${savedPosition.y}px`;
			}

        } else {
            container.style.left = "50%";
            container.style.transform = "translateX(-48%)";
            container.style.top = "60px";
			container.style.width = "400px";
        }    

        // Variables for font size adjustments
        let fontSizeTime = JSON.parse(localStorage.getItem("fontSizeTime")) ?? 28; // Load saved size or default to 36px

        // Update font sizes for all time display elements
        function updateFontSizes() {
            // Calculate sizes based on screen width condition
            let adjustedFontSizeTime = window.innerWidth <= 768 ? fontSizeTime * 1.0 : fontSizeTime;
            let adjustedFontLabelSize = adjustedFontSizeTime / 2;
            let adjustedFontDateSize = (adjustedFontSizeTime / 1.5) - 3;

            // Apply sizes to elements
            const timeElements = container.querySelectorAll(".text");
            timeElements.forEach(el => el.style.fontSize = `${adjustedFontSizeTime}px`);

            const labelElements = container.querySelectorAll("h2");
            labelElements.forEach(el => el.style.fontSize = `${adjustedFontLabelSize}px`);

            const dateElements = container.querySelectorAll(".date-display");
            dateElements.forEach(el => el.style.fontSize = `${adjustedFontDateSize}px`);
        }

        // Add scroll event listener to change font size on mouse wheel
        container.addEventListener("wheel", (event) => {
            event.preventDefault(); // Prevent page from scrolling
            fontSizeTime += event.deltaY < 0 ? 2 : -2; // Increase or decrease font size
            updateFontSizes(); // Apply updated font sizes
            localStorage.setItem("fontSizeTime", JSON.stringify(fontSizeTime)); // Save to localStorage
        });

        // Variables for drag functionality
        let isDragging = false;
        let wasDragged = false; // New flag to track if dragging occurred
        let startX, startY, initialX, initialY;

        // Drag functionality
        container.addEventListener("mousedown", (event) => {
            isDragging = true;
            wasDragged = false; // Reset flag when starting a drag
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
                wasDragged = true; // Set flag to true if mouse moved during drag
            }
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                localStorage.setItem("timeDisplayPosition", JSON.stringify({ x: container.offsetLeft, y: container.offsetTop }));
                isDragging = false;
            }
        });

        // Long press functionality for toggling timeDisplayInline
        let isLongPress = false;
        let longPressTimeout;

        container.addEventListener("mousedown", (event) => {
            longPressTimeout = setTimeout(() => {
                isLongPress = true;
                timeDisplayInline = !timeDisplayInline;
                localStorage.setItem("timeDisplayInline", JSON.stringify(timeDisplayInline));
                setDisplay();
                console.log("timeDisplayInline toggled:", timeDisplayInline);
            }, 2500); // Trigger long press action after 2500ms (2.5 seconds)
        });

        container.addEventListener("mouseup", () => {
            clearTimeout(longPressTimeout);
            isLongPress = false;
        });

        // Toggle display on click
        container.addEventListener("click", (event) => {
            if (!isLongPress && !wasDragged) { // Only toggle if no long press or drag happened
                displayState = (displayState + 1) % 3;
                localStorage.setItem("displayState", displayState);
                setDisplay();
            }
        });

        // Display update functions
        const DoubleTimeContainerHtml = () => {
            const utcDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px; font-size: ${fontSizeTime / 6}px;" id="utc-date">${getCurrentUTCDate()}</div>` : '';
            const localDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px; font-size: ${fontSizeTime / 6}px;" id="local-date">${getCurrentLocalDate()}</div>` : '';
            
            if (timeDisplayInline) {
                return `
                    <div id="time-content" style="display: flex; align-items: center; justify-content: center;">
                        <div id="utc-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-utc-time">${getCurrentUTCTime()}</div>
                            ${utcDateHtml}
                        </div>
                        <div id="local-container" style="text-align: center; margin-right: 20px;">                           
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                    </div>`;
            } else {
                return `
                    <div id="time-content" style="text-align: center;">
                        <div id="utc-container">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-utc-time">${getCurrentUTCTime()}</div>
                            ${utcDateHtml}
                        </div>
                        <div id="local-container" style="margin-top: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px;" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-time">${getCurrentTime()}</div>
                            ${localDateHtml}
                        </div>
                    </div>`;
            }
        };

        const SingleTimeContainerHtml = (timeLabel, timeValue, dateHtml) => {
            return `
                <div id="time-content" style="text-align: center;">
                    <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${fontSizeTime / 2}px; text-align: center;" id="single-label" class="mb-0">${timeLabel}</h2>
                    <div class="${phoneDisplayClass} text" style="margin: -10px; font-size: ${fontSizeTime}px;" id="current-single-time">${timeValue}</div>
                    ${dateHtml}
                </div>`;
        };

        const setDisplay = () => {
            if (displayState === 0) {
                container.innerHTML = DoubleTimeContainerHtml();
            } else if (displayState === 1) {
                container.innerHTML = SingleTimeContainerHtml("LOCAL TIME", getCurrentTime(), showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;">${getCurrentLocalDate()}</div>` : '');
            } else {
                container.innerHTML = SingleTimeContainerHtml("WORLD TIME", getCurrentUTCTime(), showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;">${getCurrentUTCDate()}</div>` : '');
            }
            updateFontSizes(); // Apply initial font size settings
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

        // Spacing adjustment for .tuner-info
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
