setTimeout(() => {
    ////////////////////////////////////////////////////////////
    ///                                                      ///
    ///  TIME DISPLAY SCRIPT FOR FM-DX-WEBSERVER (V2.3)      ///
    ///                                                      ///
    ///  by Highpoint                last update: 09.11.24   ///
    ///                                                      ///
    ///  https://github.com/Highpoint2000/webserver-time     ///
    ///                                                      ///
    ////////////////////////////////////////////////////////////

    let showTimeOnPhone = true;
    let initialDisplayState = '0';
    let timeDisplayInline = true;
    let showDate = true;

    const plugin_version = '2.3';

    function loadConfig() {
        return fetch('/js/plugins/TimeDisplay/configPlugin.json')
            .then(response => {
                if (!response.ok) {
                    console.warn('Config file not found, using default values.');
                    return null;
                }
                return response.json();
            })
            .then(config => {
                if (config) {
                    showTimeOnPhone = typeof config.showTimeOnPhone === 'boolean' ? config.showTimeOnPhone : showTimeOnPhone;
                    initialDisplayState = config.initialDisplayState || initialDisplayState;
                    timeDisplayInline = typeof config.timeDisplayInline === 'boolean' ? config.timeDisplayInline : timeDisplayInline;
                    showDate = typeof config.showDate === 'boolean' ? config.showDate : showDate;
                    console.log("Time Display successfully loaded config from configPlugin.json.");
                } else {
                    console.log("Using default configuration values.");
                }
            })
            .catch(error => {
                console.log("Time Display failed to load configPlugin.json:", error);
            });
    }

    loadConfig().then(() => {
        initializeTimeDisplay();
    });

    function initializeTimeDisplay() {
        const phoneDisplayClass = showTimeOnPhone ? 'show-phone' : 'hide-phone';
        let displayState = localStorage.getItem('displayState');
        
        // Set displayState based on initialDisplayState if localStorage is empty
        if (displayState === null) {
            displayState = parseInt(initialDisplayState, 10);
            localStorage.setItem('displayState', displayState);
        } else {
            displayState = parseInt(displayState, 10);
        }

        const getCurrentTime = () => new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const getCurrentUTCTime = () => new Date().toUTCString().split(' ')[4];
        
        // Funktion zum Abrufen des aktuellen lokalen Datums
        const getCurrentLocalDate = () => new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
        
        // Funktion zum Abrufen des aktuellen UTC-Datums unter Berücksichtigung der Datumsgrenze
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
        const getFontSizeMarginSingle = () => (window.innerHeight >= 860 && window.innerWidth >= 930 ? '-15px' : window.innerWidth <= 768 ? '-13px' : '-10px');

        const DoubleTimeContainerHtml = () => {
            const utcDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;" id="utc-date">${getCurrentUTCDate()}</div>` : '';
            const localDateHtml = showDate ? `<div class="${phoneDisplayClass} date-display" style="margin-top: -10px;" id="local-date">${getCurrentLocalDate()}</div>` : '';
            
            if (timeDisplayInline) {
                return `
                    <div id="time-content" style="display: flex; align-items: center; justify-content: center;">
                        <div id="utc-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: -10px; font-size: ${getFontLabel()};" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text-left" style="font-size: ${getFontSizeTime()}; margin: ${getFontSizeMarginDouble()} 0 0 0;" id="current-utc-time">${getCurrentUTCTime()}</div>
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
                        <div id="local-container">
                            <h2 class="${phoneDisplayClass}" style="margin: 3px; font-size: ${getFontLabel()};" id="local-label">LOCAL TIME</h2>
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
        container.title = `Plugin Version: ${plugin_version}`;
        
        const wrapperElement = document.getElementById("wrapper");
        if (wrapperElement) {
            wrapperElement.prepend(container);
        } else {
            console.error("Element with id #wrapper not found.");
        }

        const tunerInfoPanel = document.querySelector(".panel-100.no-bg.tuner-info");
        const savedPosition = JSON.parse(localStorage.getItem('timeDisplayPosition'));

        if (!savedPosition) {
            if (tunerInfoPanel) {
                if (window.innerWidth >= 930) {
                    container.style.left = "0px";
                } else {
                    container.style.width = "100%";
                    container.style.left = "50%";
                    container.style.transform = "translateX(-50%)";
                }
                container.style.top = "0px";
            } else {
                container.style.left = "50%";
                container.style.top = "0px";
                container.style.transform = "translateX(-50%)";
            }
        } else {
            container.style.left = `${savedPosition.x}px`;
            container.style.top = `${savedPosition.y}px`;
        }

        let isDragging = false;
        let isLongPress = false;
        let wasDragged = false;
        let startX, startY, initialX, initialY;
        let longPressTimeout;

        container.addEventListener("mousedown", (event) => {
            if (window.innerWidth >= 930) {
                wasDragged = false;
                startX = event.clientX;
                startY = event.clientY;
                initialX = container.offsetLeft;
                initialY = container.offsetTop;

                longPressTimeout = setTimeout(() => {
                    isLongPress = true;
                    isDragging = true;
                }, 500); // Trigger drag mode after 500ms
            }
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                wasDragged = true; // Set the flag if movement occurs
                const dx = event.clientX - startX;
                const dy = event.clientY - startY;
                const newLeft = Math.min(Math.max(0, initialX + dx), wrapperElement.offsetWidth - container.offsetWidth);
                const newTop = Math.min(Math.max(0, initialY + dy), wrapperElement.offsetHeight - container.offsetHeight);

                container.style.left = `${newLeft}px`;
                container.style.top = `${newTop}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            if (window.innerWidth >= 930 && isLongPress && isDragging) {
                localStorage.setItem("timeDisplayPosition", JSON.stringify({ x: container.offsetLeft, y: container.offsetTop }));
            }
            clearTimeout(longPressTimeout);
            isDragging = false;
            isLongPress = false;
        });

        container.addEventListener('click', (event) => {
            if (!wasDragged) {
                displayState = (displayState + 1) % 3;
                localStorage.setItem('displayState', displayState);
                setDisplay();
            }
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
            
            // Update the dates for both UTC and Local displays separately
            const localDateElement = document.getElementById("local-date");
            if (localDateElement) localDateElement.textContent = getCurrentLocalDate();
            
            const utcDateElement = document.getElementById("utc-date");
            if (utcDateElement) utcDateElement.textContent = getCurrentUTCDate();
        };

        setInterval(updateTime, 1000);

        // Insert appropriate <br> tags for tuner-info panel based on conditions
        if (window.innerWidth < 930 && tunerInfoPanel && showTimeOnPhone) {
            if (window.innerWidth <= 768 && !timeDisplayInline) {
                tunerInfoPanel.insertAdjacentHTML("beforebegin", "<br><br><br><br><br><br>");
            } else {
                tunerInfoPanel.insertAdjacentHTML("beforebegin", "<br><br><br><br>");
            }
        }

        window.addEventListener("resize", () => {
            if (window.innerWidth < 930 && tunerInfoPanel && showTimeOnPhone) {
                if (window.innerWidth <= 768 && !timeDisplayInline) {
                    tunerInfoPanel.insertAdjacentHTML("beforebegin", "<br><br><br><br><br><br>");
                } else {
                    tunerInfoPanel.insertAdjacentHTML("beforebegin", "<br><br><br><br>");
                }
            } else if (tunerInfoPanel) {
                tunerInfoPanel.previousSibling && tunerInfoPanel.previousSibling.nodeName === "BR" &&
                tunerInfoPanel.parentNode.removeChild(tunerInfoPanel.previousSibling);
            }
        });
    }
}, 100); // Delay execution by 100ms
