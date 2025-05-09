let selectedLang = document.querySelector("#languageSelector"); //Language selector

let settingsBtn = document.querySelector("#settingsButton"); //Top
let translateBtn = document.querySelector("#translateButton"); //Lateral
let insertMediaBtn = document.querySelector("#insertMedia"); //Lateral
let clearBtn = document.querySelector("#clearButton"); //Lateral
let textArea = document.querySelector("#inputText"); //Main
let outputText = document.querySelector("#outputText"); //Main
let textDiv = document.querySelector(".text-input"); //Main

let removeMediaBtn = document.querySelector("#removeMedia"); //Main
let mediaContainer = document.querySelector("#mediaContainer"); //Main
let mediaFileName = document.querySelector("#mediaFileName"); //Main

let microphoneButton = document.querySelector("#microphoneButton"); //Main
let microphoneIcon = document.querySelector("#microphoneIcon"); //Main

const strings_file = new FileReader([""], "strings.json", { type: "application/json" }); // Create a new file object
const strings = JSON.parse(strings_file.result); // Read the file and parse it as JSON

const TRANSLATE_URL = "http://127.0.0.1:3000/translate"; // Ensure consistent localhost usage

microphoneButton.addEventListener("click", () => {
    event.preventDefault(); // Prevent default action of the button
    if (microphoneIcon.classList.contains("fa-microphone")) {
        microphoneIcon.classList.remove("fa-microphone");
        microphoneIcon.classList.add("fa-microphone-slash");
        startRecording(); // Start recording audio
    } else {
        microphoneIcon.classList.remove("fa-microphone-slash");
        microphoneIcon.classList.add("fa-microphone");
        stopRecording(); // Stop recording audio
    }
});

translateBtn.addEventListener("click", () => {
    event.preventDefault(); // Prevent default action of the button
    const text = textArea.value; // Get the text from the textarea
    if (text.trim() === "") {
        alert("Please enter text to translate."); // Alert if the textarea is empty
    } else {
        sendTextToServer(text); // Send the text to the server for translation
    }
});

//script to handle the recording of the audio and the sending of the audio to the server and wait for the response, without creating a new audio element

let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;
let language = "en"; // Default language

selectedLang.addEventListener("change", (event) => {
    selectedLang = event.target.value; // Get the selected language from the dropdown
    language = selectedLang; // Update the language variable
    console.log("Selected language:", selectedLang);
});


const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioChunks = []; // Clear previous audio chunks
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                audioUrl = URL.createObjectURL(audioBlob);
                sendAudioToServer(audioBlob); // Send the audio blob to the server
            });
        });
}

const stopRecording = () => {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop()); // Stop all tracks of the stream
    mediaRecorder = null; // Clear the media recorder
}

const sendTextToServer = (text) => {
    outputText.value = strings.translating[language]; // Update the output text area with a loading message
    fetch(TRANSLATE_URL, {
        method: "POST",
        body: JSON.stringify({ text, language }), // Send the text and selected language as JSON
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log("Translation response:", data.translation);
            outputText.value = data.translation; // Update the text area with the translation
        })
        .catch(error => {
            console.error("Error sending text to server:", error);
        });
}

const sendAudioToServer = (audioBlob) => {
    const formData = new FormData();
    outputText.value = strings.translating_audio[language]; // Update the output text area with a loading message
    formData.append("audio", audioBlob, "recording.wav"); // Append the audio blob to the form data
    formData.append("language", language); // Append the selected language to the form data
    fetch(TRANSLATE_URL, {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log("Transcription:", data.text);
            console.log("Translation response:", data.translation);
            outputText.value = data.translation; // Update the text area with the translation
            textArea.value = data.text; // Update the text area with the transcription
        })
        .catch(error => {
            console.error("Error sending audio to server:", error);
        });
}

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