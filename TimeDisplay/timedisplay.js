(() => {

    ////////////////////////////////////////////////////////////
    ///                                                      ///
    ///  TIME DISPLAY SCRIPT FOR FM-DX-WEBSERVER (V1.0a)     ///
    ///                                                      ///
    ///  by Highpoint                last update: 07.11.24   ///
    ///                                                      ///
    ///  https://github.com/Highpoint2000/webserver-time     ///
    ///                                                      ///
    ////////////////////////////////////////////////////////////

    const showTimeOnPhone = true; // Set to true to enable display on mobile, false to hide it

    ////////////////////////////////////////////////////////////

    const plugin_version = '1.0'; // Plugin Version
    const phoneDisplayClass = showTimeOnPhone ? 'show-phone' : 'hide-phone';

    // Function to determine the display state
    const getStoredDisplayState = () => {
        const storedState = localStorage.getItem('displayState');
        return storedState !== null ? parseInt(storedState, 10) : 2; // Default to UTC only (2)
    };

    // Set the display state based on the stored value or default value
    let displayState = getStoredDisplayState();

    // Fix the width of rt-container
    const rtContainer = document.getElementById("rt-container");
    if (rtContainer) {
        rtContainer.style.setProperty('width', '450px', 'important');
        rtContainer.style.flex = 'none'; // Prevent flex growth or shrinking
    } else {
        console.error("rt-container not found.");
        return; // Exit if the container does not exist
    }

    // Add CSS styles for the data elements
    const style = document.createElement('style');
style.innerHTML = `
#data-rt0, #data-rt1 {
    width: calc(92%); /* Volle Breite minus den Abstand */
    height: 20px; /* Feste Höhe */
	margin-left: 20px;
    overflow: hidden; /* Verhindert, dass der Inhalt überläuft */
    white-space: nowrap; /* Verhindert Umbrüche im Text */
    line-height: 20px; /* Zentriert den Text vertikal innerhalb der Höhe */
}

`;

    document.head.appendChild(style);

    // Function to format the current local time as HH:MM:SS
    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // Function to get current UTC time as HH:MM:SS
    const getCurrentUTCTime = () => {
        const now = new Date();
        return now.toUTCString().split(' ')[4]; // Extracts HH:MM:SS part
    };

// Define the HTML code for the double time display
const DoubleTimeContainerHtml = () => 
    '<div id="time-content" style="text-align: right;">' +
    '    <div style="margin-bottom: 10px; display: flex; justify-content: right; align-items: center;">' +  // Container for UTC with label inline
    '        <h2 class="' + phoneDisplayClass + '" style="margin: 2.5px 10px 0 0; font-size: 23px;" id="utc-label">UTC</h2>' +
    '        <div class="' + phoneDisplayClass + ' text-small" style="font-size: 32px; margin: 5px 0 0 0;" id="current-utc-time">' + getCurrentUTCTime() + '</div>' +
    '    </div>' +
    '    <div style="display: flex; justify-content: center; align-items: right;">' +  // Container for Local time with label inline
    '        <h2 class="' + phoneDisplayClass + '" style="margin: -15px 10px 0 0; font-size: 23x;" id="local-label">LOC</h2>' +
    '        <div class="' + phoneDisplayClass + ' text-small" style="font-size: 32px; margin: -20px 0 0 0;" id="current-time">' + getCurrentTime() + '</div>' +
    '    </div>' +
    '</div>';



    // Define the HTML code for the single time display
    const SingleTimeContainerHtml = (timeLabel, timeValue) =>
        '<div id="time-content">' +
        '    <h2 class="' + phoneDisplayClass + '" style="margin-top: 5px; font-size: 23px;" id="single-label" class="mb-0">' + timeLabel + '</h2>' +
        '    <div class="' + phoneDisplayClass + ' text-small" style="margin-top: 0px; font-size: 36px;" id="current-single-time">' + timeValue + '</div>' +
        '</div>';

    // Create a persistent container for toggling time displays
    const container = document.createElement("div");
    container.className = "panel-33";
    container.style.width = "230px";
    container.style.height = "auto";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.flexDirection = "column";
    container.style.cursor = "pointer";
    container.title = `Plugin Version: ${plugin_version}`;
    container.id = "time-toggle-container";
    document.getElementById("rt-container").insertAdjacentElement("afterend", container);

    // Set initial display based on saved state
    const setInitialDisplay = () => {
        if (displayState === 0) {
            container.innerHTML = DoubleTimeContainerHtml();
        } else if (displayState === 1) {
            container.innerHTML = SingleTimeContainerHtml("LOCAL", getCurrentTime());
        } else {
            container.innerHTML = SingleTimeContainerHtml("UTC", getCurrentUTCTime());
        }
    };

    // Initial set up of display based on stored state
    setInitialDisplay();

    // Function to update the displayed local and UTC time
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

    // Update the time every second
    setInterval(updateTime, 1000);

    // Toggle visibility of time displays
    container.addEventListener('click', () => {
        // Cycle through 0, 1, 2
        displayState = (displayState + 1) % 3;

        switch (displayState) {
            case 0: // Both
                container.innerHTML = DoubleTimeContainerHtml();
                break;
            case 1: // Local only
                container.innerHTML = SingleTimeContainerHtml("LOCAL", getCurrentTime());
                break;
            case 2: // UTC only
                container.innerHTML = SingleTimeContainerHtml("UTC", getCurrentUTCTime());
                break;
        }

        // Save the current state in localStorage
        localStorage.setItem('displayState', displayState);
    });

    // Optional: Show or hide the container based on `showTimeOnPhone`
    container.style.display = showTimeOnPhone ? 'flex' : 'none';

    // Save the display setting
    localStorage.setItem('showTimeOnPhone', JSON.stringify(showTimeOnPhone));
})();
