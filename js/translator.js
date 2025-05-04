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

let microphoneButton = document.querySelector("#microphoneButton"); //Main
let microphoneIcon = document.querySelector("#microphoneIcon"); //Main

const selectedMedia = {
    type: null,
    uri: null,
    alt: null,
}

const TRANSLATE_URL = "http://127.0.0.1:3000/translate"; // Ensure consistent localhost usage

microphoneButton.addEventListener("click", () => {
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

let mediaRecorder;
let audioChunks = [];
let audio_uri;

const startRecording = () => {
    console.log("Recording started...");
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" }); // Change type to "audio/mp3"
                const audioUrl = URL.createObjectURL(audioBlob);
                const audioElement = document.createElement("audio");
                audioElement.src = audioUrl;
                audioElement.controls = true;
                textDiv.appendChild(audioElement);

                // Prepare the audio file for sending to the server
                selectedMedia.type = "audio";
                selectedMedia.uri = audioUrl;
                selectedMedia.alt = "recording.mp3"; // Update file extension to .mp3
                audio_uri = audioUrl; // Store the audio URL for later use
                console.log("Audio URL:", audioUrl);

                stream.getTracks().forEach((track) => track.stop());
                audioChunks = []; // Clear the chunks for the next recording
            };
        })
        .catch((error) => {
            console.error("Error accessing microphone:", error);
        });
};

const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        console.log("Recording stopped...");
        mediaRecorder.stop();

        // Send the MP3 file to the server
        const formData = new FormData();
        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" }); // Change type to "audio/mp3"
        formData.append("audio", audioBlob, "recording.mp3"); // Update file extension to .mp3
        formData.append("lang", selectedLang.value); // Append the selected language to the form data
        
        formData.append("text", textArea.value); // Append the text area content to the form data

        formData.append("media", JSON.stringify(selectedMedia)); // Append the selected media to the form data

        console.log("Form data:", formData);

        fetch(TRANSLATE_URL, {
            method: "POST",
            body: formData,
            headers: {
                "Access-Control-Allow-Origin": "*", // Add this header if the server supports it
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Translation response:", data);
                // Update the text area with the translated content
                textArea.value = data.translated_text || "Translation failed.";
                // Clear the selected media after translation
                clearMedia();
            })
            .catch((error) => {
                console.error("Error during translation:", error);
                textArea.value = "Translation failed. Please try again.";
            });
    }
    else if (mediaRecorder) {
        console.warn("Recording is already stopped.");
    } else {
        console.warn("No active recording to stop.");
    }
};

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