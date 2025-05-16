let settingsBtn = document.querySelector("#settingsButton"); //Top
let closeSettingsBtn = document.querySelector("#closeSettings"); //Top
let settingsYourLanguageSelector = document.querySelector("#yourLanguageSelector"); //Your language selector in settings
let settingsAutoTranslate = document.querySelector("#autoTranslate"); //Auto-translate 
let saveSettingsBtn = document.querySelector("#saveSettings"); //Settings save button
let cancelSettingsBtn = document.querySelector("#cancelSettings"); //Settings cancel button

settingsBtn.addEventListener("click", () => {
    event.preventDefault(); // Prevent default action of the button
    const settingsModal = document.querySelector("#settingsPopup"); // Get the settings popup modal
    settingsModal.style.display = "block"; // Show the settings modal

    document.querySelector("div.blur").style.display = "block"; // Show the blur div
});

closeSettingsBtn.addEventListener("click", () => {
    event.preventDefault(); // Prevent default action of the button
    const settingsModal = document.querySelector("#settingsPopup"); // Get the settings popup modal
    settingsModal.style.display = "none"; // Hide the settings modal

    document.querySelector("div.blur").style.display = "none"; // Hide the blur div
});

saveSettingsBtn.addEventListener("click", () => {
    event.preventDefault(); // Prevent default action of the button
    const settingsModal = document.querySelector("#settingsPopup"); // Get the settings popup modal
    settingsModal.style.display = "none"; // Hide the settings modal

    document.querySelector("div.blur").style.display = "none"; // Hide the blur div

    // Save the selected language to a cookie
    const selectedLanguage = settingsYourLanguageSelector.value; // Get the selected language from the dropdown
    cookieManager.setCookie("language", selectedLanguage, 7); // Set the cookie with the selected language
    console.log("Settings saved. Selected language:", selectedLanguage);
});

cancelSettingsBtn.addEventListener("click", () => {
    event.preventDefault(); // Prevent default action of the button
    const settingsModal = document.querySelector("#settingsPopup"); // Get the settings popup modal
    settingsModal.style.display = "none"; // Hide the settings modal

    document.querySelector("div.blur").style.display = "none"; // Hide the blur div

    // Reset the language selector to the value from the cookie
    const yourLanguage = cookieManager.getCookie("language") || "en"; // Get the language from the cookie or default to English
    settingsYourLanguageSelector.value = yourLanguage; // Set the value of the language selector in settings
});


// COOKIES SET

settingsYourLanguageSelector.addEventListener("change", (event) => {
    settingsYourLanguageSelector = event.target.value; // Get the selected language from the settings
    cookieManager.setCookie("language", settingsYourLanguageSelector, 7); // Set the cookie with the selected language
    console.log("Settings selected language:", settingsYourLanguageSelector);
});

settingsAutoTranslate.addEventListener("change", (event) => {
    autoTranslation = event.target.value; // Get the auto-translation setting from the checkbox
    cookieManager.setCookie("autoTranslation", autoTranslation, 7); // Set the cookie with the auto-translation setting
    console.log("Auto-translation setting:", autoTranslation);
});
