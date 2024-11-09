(() => {

    ////////////////////////////////////////////////////////////
    ///                                                      ///
    ///  TIME DISPLAY SCRIPT FOR FM-DX-WEBSERVER (V2.2)      ///
    ///                                                      ///
    ///  by Highpoint                last update: 09.11.24   ///
    ///                                                      ///
    ///  https://github.com/Highpoint2000/webserver-time     ///
    ///                                                      ///
    ////////////////////////////////////////////////////////////

    // Default values - set your personal settings in the configPlugin.json!
    let showTimeOnPhone = true;               // true to display on mobile, false to hide it
    let VerticalCorrectionPosition = '0';     // Pixel value for vertical correction of the time display (e.g., 80, -100 / default = 0)
    let HorizontalCorrectionPosition = '0';   // Pixel value for horizontal correction of the time display (e.g., 50, -60 / default = 0)
    let initialDisplayState = '0';            // 0 for both, 1 for local time only, 2 for UTC only (default display on first load)
    let timeDisplayInline = true;             // true to display times side-by-side, false to display them stacked vertically
    let showDate = true;                      // true to show the date, false to hide it

    const plugin_version = '2.2'; // Plugin Version

    // Function to load configuration from configPlugin.json
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
                    showTimeOnPhone = (typeof config.showTimeOnPhone === 'boolean') ? config.showTimeOnPhone : showTimeOnPhone;
                    VerticalCorrectionPosition = config.VerticalCorrectionPosition || VerticalCorrectionPosition;
                    HorizontalCorrectionPosition = config.HorizontalCorrectionPosition || HorizontalCorrectionPosition;
                    initialDisplayState = config.initialDisplayState || initialDisplayState;
                    timeDisplayInline = (typeof config.timeDisplayInline === 'boolean') ? config.timeDisplayInline : timeDisplayInline;
                    showDate = (typeof config.showDate === 'boolean') ? config.showDate : showDate;
                    console.log("Time Display successfully loaded config from configPlugin.json.");
                } else {
                    console.log("Using default configuration values.");
                }
            })
            .catch(error => {
                console.log("Time Display failed to load configPlugin.json:", error);
            });
    }

    // Load config on startup
    loadConfig().then(() => {
        initializeTimeDisplay(); // Initialize display after config loading
    });

    function initializeTimeDisplay() {
        const phoneDisplayClass = showTimeOnPhone ? 'show-phone' : 'hide-phone';

        // Retrieve the display state from localStorage or use the initial setting
        let displayState = localStorage.getItem('displayState');
        if (displayState === null) {
            displayState = initialDisplayState;
            localStorage.setItem('displayState', displayState);
        } else {
            displayState = parseInt(displayState, 10);
        }

        // CSS for the data elements
        const style = document.createElement('style');
        style.innerHTML = `
            #data-rt0, #data-rt1 {
                width: calc(92%);
                height: 20px;
                margin-left: 20px;
                overflow: hidden;
                white-space: nowrap;
                line-height: 20px;
            }
        `;
        document.head.appendChild(style);

        // Functions for formatting time and date
        const getCurrentTime = () => {
            const now = new Date();
            return now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        };

        const getCurrentUTCTime = () => {
            const now = new Date();
            return now.toUTCString().split(' ')[4];
        };

        const getCurrentDate = () => {
            const now = new Date();
            return now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
        };

        // Functions to get font sizes and margins based on viewport
        const getFontLabel = () => window.innerHeight >= 860 ? '18px' : '14px';
        const getFontSizeTime = () => window.innerHeight >= 860 ? '36px' : '30px';
        const getFontSizeMarginDouble = () => window.innerHeight >= 860 && window.innerWidth >= 930 ? '-25px' : (window.innerWidth <= 768 ? '-15px' : '-25px');
        const getFontSizeMarginSingle = () => window.innerHeight >= 860 && window.innerWidth >= 930 ? '-15px' : (window.innerWidth <= 768 ? '-15px' : '-25px');

        // HTML structure for double time display with date
        const DoubleTimeContainerHtml = () => {
            const dateHtml = showDate ? `<div class="date-display" style="margin-top: -10px;">${getCurrentDate()}</div>` : '';
            if (timeDisplayInline) {
                return `
                    <div id="time-content" style="display: flex; align-items: center; justify-content: center; margin-top: ${VerticalCorrectionPosition - 10}px;">
                        <div id="utc-container" style="text-align: center; margin-right: 20px;">
                            <h2 class="${phoneDisplayClass}" style="margin: 10px; font-size: ${getFontLabel()};" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text-left" style="font-size: ${getFontSizeTime()}; margin: ${getFontSizeMarginDouble()} 0 0 0;" id="current-utc-time">${getCurrentUTCTime()}</div>
                            ${dateHtml}
                        </div>
                        <div id="local-container" style="text-align: center; margin-right: 20px;">                           
                            <h2 class="${phoneDisplayClass}" style="margin: 10px; font-size: ${getFontLabel()};" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text-left" style="font-size: ${getFontSizeTime()}; margin: ${getFontSizeMarginDouble()} 0 0 0;" id="current-time">${getCurrentTime()}</div>
						    ${dateHtml}
                        </div>
                    </div>`;
            } else {
                return `
                    <div id="time-content" style="text-align: center; margin-top: ${VerticalCorrectionPosition - 10}px;">
                        <div id="utc-container">
                            <h2 class="${phoneDisplayClass}" style="margin: 10px; font-size: ${getFontLabel()};" id="utc-label">WORLD TIME</h2>
                            <div class="${phoneDisplayClass} text-left" style="font-size: ${getFontSizeTime()}; margin: ${getFontSizeMarginDouble()} 0 0 0;" id="current-utc-time">${getCurrentUTCTime()}</div>
                            ${dateHtml}
                        </div>
                        <div id="local-container">
                            <h2 class="${phoneDisplayClass}" style="margin: 0; font-size: ${getFontLabel()};" id="local-label">LOCAL TIME</h2>
                            <div class="${phoneDisplayClass} text-left" style="font-size: ${getFontSizeTime()}; margin: -15px 0 0 0;" id="current-time">${getCurrentTime()}</div>
                            ${dateHtml}
                        </div>
                    </div>`;
            }
        };

        // HTML structure for single time display with date
        const SingleTimeContainerHtml = (timeLabel, timeValue) => {
            const dateHtml = showDate ? `<div class="date-display" style="margin-top: -10px;">${getCurrentDate()}</div>` : '';
            return `
                <div id="time-content" style="text-align: center;">
                    <h2 class="${phoneDisplayClass}" style="margin-top: ${VerticalCorrectionPosition}px; font-size: ${getFontLabel()}; text-align: center;" id="single-label" class="mb-0">${timeLabel}</h2>
                    <div class="${phoneDisplayClass} text-left" style="margin-top: ${getFontSizeMarginSingle()}; font-size: ${getFontSizeTime()};" id="current-single-time">${timeValue}</div>
                    ${dateHtml}
                </div>`;
        };

        // Create a container for time displays
        const container = document.createElement("div");
        container.style.width = "230px";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.flexDirection = "column";
        container.style.cursor = "pointer";
        container.style.transform = "translateX(-50%)";
        container.style.marginTop = "0px";
        container.title = `Plugin Version: ${plugin_version}`;
        container.id = "time-toggle-container";

        const setContainerPosition = () => {
            if (window.innerWidth < 930) {
                container.style.left = `calc(50% + ${HorizontalCorrectionPosition}px)`;
                container.style.position = 'relative';
            } else {
                container.style.left = window.innerHeight >= 860 ? `calc(50% + ${HorizontalCorrectionPosition}px)` : `calc(35% + ${HorizontalCorrectionPosition}px)`;
                container.style.position = 'absolute';
            }
        };

        setContainerPosition();

        const wrapperElement = document.getElementById("wrapper");
        if (wrapperElement) {
            wrapperElement.prepend(container);
        } else {
            console.error("Element with id #wrapper not found.");
        }

        const setDisplay = () => {
            if (displayState === 0) {
                container.innerHTML = DoubleTimeContainerHtml();
            } else if (displayState === 1) {
                container.innerHTML = SingleTimeContainerHtml("LOCAL TIME", getCurrentTime());
            } else {
                container.innerHTML = SingleTimeContainerHtml("WORLD TIME", getCurrentUTCTime());
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
            
            const dateDisplays = document.querySelectorAll(".date-display");
            dateDisplays.forEach(dateDisplay => dateDisplay.textContent = getCurrentDate());
        };

        setInterval(updateTime, 1000);

        container.addEventListener('click', () => {
            displayState = (displayState + 1) % 3;
            localStorage.setItem('displayState', displayState);
            setDisplay();
        });

        window.addEventListener('resize', () => {
            setContainerPosition();
            setDisplay();
        });
    }

})();
