let selectedLang = document.querySelector("#languageSelector");

//CODE WHICH SENDS THE TO BE TRANSLATED CONTENT TO THE SERVER,
//WAITS FOR THE RESPONSE
//AND UPDATES THE PAGE WITH THE TRANSLATED CONTENT    

let settingsBtn = document.querySelector("#settingsButton"); //Top
let translateBtn = document.querySelector("#translateButton"); //Lateral
let insertMediaBtn = document.querySelector("#insertMedia"); //Lateral
let clearBtn = document.querySelector("#clearButton"); //Lateral
let textArea = document.querySelector("#inputText"); //Main
let textDiv = document.querySelector(".text-input"); //Main

let removeMediaBtn = document.querySelector("#removeMedia"); //Main
let mediaContainer = document.querySelector("#mediaContainer"); //Main
let mediaFileName = document.querySelector("#mediaFileName"); //Main

const selectedMedia = {
    type: null,
    uri: null,
    alt: null,
}

const HTTPS_REQ = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};
const HTTPS_REQ_BODY = {
  text: "",
  targetLang: "en",
};
const HTTPS_REQ_BODY_MEDIA = {
  text: "",
  targetLang: "en",
  media: selectedMedia
};

const TRANSLATE_URL = "http://localhost:5000/translate";

const clearText = () => {
    textArea.value = "";
    textArea.focus();
}

const clearMedia = () => {
    selectedMedia.type = null;
    selectedMedia.uri = null;
    selectedMedia.alt = null;

    mediaContainer.style = "display: none"; // Hide the media container

    mediaFileName.innerHTML = ""; // Clear the media file name
    
}

clearBtn.addEventListener("click", () => {
    clearText();
    clearMedia();
});

insertMediaBtn.addEventListener("click", () => {
    // Open a file dialog to select media files (audio/video)
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "audio/*,video/*"; // Accept only audio and video files
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type.split("/")[0]; // Get the type (audio or video)
            const fileUrl = URL.createObjectURL(file); // Create a URL for the file

            selectedMedia.type = fileType;
            selectedMedia.uri = fileUrl;
            selectedMedia.alt = file.name; // Use the file name as alt text

            mediaContainer.style = "display: flex"; // Show the media container

            mediaFileName.innerHTML = file.name; // Display the file name
            mediaFileName.setAttribute("title", file.name); // Set the title attribute for the file name
        }
        console.log("Selected media:", selectedMedia);
    });
    fileInput.click(); // Simulate a click to open the file dialog
});

removeMediaBtn.addEventListener("click", () => {
    // Remove the media element from the text area
    const mediaElements = textDiv.querySelectorAll("audio, video");
    mediaElements.forEach((mediaElement) => {
        textDiv.removeChild(mediaElement);
    });
    clearMedia();
});