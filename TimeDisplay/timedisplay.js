(() => {

    ////////////////////////////////////////////////////////////
    ///                                                      ///
    ///  TIME DISPLAY SCRIPT FOR FM-DX-WEBSERVER (V2.0)      ///
    ///                                                      ///
    ///  by Highpoint                last update: 08.11.24   ///
    ///                                                      ///
    ///  https://github.com/Highpoint2000/webserver-time     ///
    ///                                                      ///
    ////////////////////////////////////////////////////////////

    const showTimeOnPhone = true; 		// Set to true to display on mobile, false to hide it
    const VerticalCorrection = '0'; 	// Pixel value for vertical correction of the time display (e.g., 80, -100 / default = 0)
    const HorizontalCorrection = '0'; 	// Pixel value for horizontal correction of the time display (e.g., 50, -60 / default = 0)

    ////////////////////////////////////////////////////////////

    const plugin_version = '1.0'; // Plugin Version
    const phoneDisplayClass = showTimeOnPhone ? 'show-phone' : 'hide-phone';

    // Function to retrieve the saved display state
    const getStoredDisplayState = () => {
        const storedState = localStorage.getItem('displayState');
        return storedState !== null ? parseInt(storedState, 10) : 2; // Default to UTC only (2)
    };

    // Set display state based on saved or default value
    let displayState = getStoredDisplayState();

    // CSS for the data elements
    const style = document.createElement('style');
    style.innerHTML = `
        #data-rt0, #data-rt1 {
            width: calc(92%); /* Full width minus margin */
            height: 20px; /* Fixed height */
            margin-left: 20px;
            overflow: hidden; /* Prevents overflow */
            white-space: nowrap; /* Prevents text wrapping */
            line-height: 20px; /* Center text vertically */
        }
    `;
    document.head.appendChild(style);

    // Function to format current local time as HH:MM:SS
    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // Function to get current UTC time as HH:MM:SS
    const getCurrentUTCTime = () => {
        const now = new Date();
        return now.toUTCString().split(' ')[4]; // Extracts HH:MM:SS part
    };

    // Function to determine font size for labels based on window height
    const getFontLabel = () => {
        return window.innerHeight >= 860 ? '18px' : '14px';
    };

    // Function to determine font size for time display based on window height
    const getFontSizeTime = () => {
        return window.innerHeight >= 860 ? '36px' : '30px';
    };

    // Function to determine margin for double time display based on window height/width
    const getFontSizeMarginDouble = () => {
        if (window.innerHeight >= 860 && window.innerWidth >= 930) {
            return '-25px';
        } else {
            return window.innerWidth <= 768 ? '-15px' : '-25px';
        }
    };

    // Function to determine margin for single time display based on window height/width
    const getFontSizeMarginSingle = () => {
        if (window.innerHeight >= 860 && window.innerWidth >= 930) {
            return '-15px';
        } else {
            return window.innerWidth <= 768 ? '-15px' : '-25px';
        }
    };

    // HTML structure for double time display
    const DoubleTimeContainerHtml = () =>
        '<div id="time-content" style="text-align: center; margin-top: ' + VerticalCorrection  + 'px;">' +
        '    <div id="time-content">' +
        '        <h2 class="' + phoneDisplayClass + '" style="margin: 10px; font-size: ' + getFontLabel() + ';" id="utc-label">WORLD TIME</h2>' +
        '        <div class="' + phoneDisplayClass + ' text-left" style="font-size: ' + getFontSizeTime() + '; margin: ' + getFontSizeMarginDouble() + ' 0 0 0;" id="current-utc-time">' + getCurrentUTCTime() + '</div>' +
        '    </div>' +
        '    <div id="time-content">' +  // Container for Local time with label inline
        '        <h2 class="' + phoneDisplayClass + '" style="margin: 0; font-size: ' + getFontLabel() + ';" id="local-label">LOCAL TIME</h2>' +
        '        <div class="' + phoneDisplayClass + ' text-left" style="font-size: ' + getFontSizeTime() + '; margin: -15px 0 0 0;" id="current-time">' + getCurrentTime() + '</div>' +
        '    </div>' +
        '</div>';

    // HTML structure for single time display
    const SingleTimeContainerHtml = (timeLabel, timeValue) =>
        '<div id="time-content" style="text-align: center;">' +
        '    <h2 class="' + phoneDisplayClass + '" style="margin-top: ' + (VerticalCorrection + 10) + 'px; font-size: ' + getFontLabel() + '; text-align: center;" id="single-label" class="mb-0">' + timeLabel + '</h2>' +
        '    <div class="' + phoneDisplayClass + ' text-left" style="margin-top: ' + getFontSizeMarginSingle() + '; font-size: ' + getFontSizeTime() + ';" id="current-single-time">' + timeValue + '</div>' +
        '</div>';

    // Persistent container for toggling time displays
    const container = document.createElement("div");
    container.style.width = "230px";
    container.style.height = "auto";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.flexDirection = "column";
    container.style.cursor = "pointer";
    container.style.transform = "translateX(-50%)";
    container.style.marginTop = "0px";
    container.title = `Plugin Version: ${plugin_version}`;
    container.id = "time-toggle-container";

    // Set left position based on viewport dimensions
    const setContainerPosition = () => {
        if (window.innerWidth < 930) {
            container.style.left = "calc(50% + " + HorizontalCorrection + "px)";
            container.style.position = 'relative';
        } else {
            container.style.left = window.innerHeight >= 860 ? "calc(50% + " + HorizontalCorrection + "px)" : "calc(35% + " + HorizontalCorrection + "px)";
            container.style.position = 'absolute';
        }
    };

    setContainerPosition(); // Initial positioning

    const wrapperElement = document.getElementById("wrapper");

    if (wrapperElement) {
        wrapperElement.prepend(container); // Prepend container to wrapper
    } else {
        console.error("Element with id #wrapper not found.");
    }

    // Set initial display based on saved state
    const setInitialDisplay = () => {
        if (displayState === 0) {
            container.innerHTML = DoubleTimeContainerHtml();
        } else if (displayState === 1) {
            container.innerHTML = SingleTimeContainerHtml("LOCAL TIME", getCurrentTime());
        } else {
            container.innerHTML = SingleTimeContainerHtml("WORLD TIME", getCurrentUTCTime());
        }
    };

    // Initial display setup
    setInitialDisplay();

    // Function to update displayed local and UTC time
    const updateTime = () => {
        const currentTimeElement = document.getElementById("current-time");
        const currentUtcTimeElement = document.getElementById("current-utc-time");
        if (currentTimeElement) currentTimeElement.textContent = getCurrentTime();
        if (currentUtcTimeElement) currentUtcTimeElement.textContent = getCurrentUTCTime();

        // Update single time if it exists
        const singleTimeElement = document.getElementById("current-single-time");
        if (singleTimeElement) {
            singleTimeElement.textContent = displayState === 1 ? getCurrentTime() : getCurrentUTCTime();
        }
    };

    // Update time every second
    setInterval(updateTime, 1000);

    // Toggle time display visibility on click
    container.addEventListener('click', () => {
        displayState = (displayState + 1) % 3;

        switch (displayState) {
            case 0: // Both
                container.innerHTML = DoubleTimeContainerHtml();
                break;
            case 1: // Local only
                container.innerHTML = SingleTimeContainerHtml("LOCAL TIME", getCurrentTime());
                break;
            case 2: // UTC only
                container.innerHTML = SingleTimeContainerHtml("WORLD TIME", getCurrentUTCTime());
                break;
        }

        // Save current state in localStorage
        localStorage.setItem('displayState', displayState);
        checkContainerVisibility(); // Check visibility after toggle
    });

    // Save display setting
    localStorage.setItem('showTimeOnPhone', JSON.stringify(showTimeOnPhone));

    // Adjust on window resize
    window.addEventListener('resize', () => {
        setContainerPosition();
        setInitialDisplay();
        checkContainerVisibility();
    });

    // Add styling for larger screens
    if (window.innerWidth > 930) {
        const tunerInfoStyle = document.createElement('style');
        tunerInfoStyle.innerHTML = `
            .tuner-info {
                text-align: left;
            }
        `;
        document.head.appendChild(tunerInfoStyle);
    }

})();
