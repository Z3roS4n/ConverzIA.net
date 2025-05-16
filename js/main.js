class Main {
    constructor() {
        this.translateBtn = document.querySelector("#translateButton");
        this.insertMediaBtn = document.querySelector("#insertMedia");
        this.clearBtn = document.querySelector("#clearButton");
        this.textArea = document.querySelector("#inputText");
        this.outputText = document.querySelector("#outputText");
        this.textDiv = document.querySelector(".text-input");

        this.removeMediaBtn = document.querySelector("#removeMedia");
        this.mediaContainer = document.querySelector("#mediaContainer");
        this.mediaFileName = document.querySelector("#mediaFileName");

        this.microphoneButton = document.querySelector("#microphoneButton");
        this.microphoneIcon = document.querySelector("#microphoneIcon");

        // Initialize event listeners
        this.initEventListeners();
    }

    initEventListeners() {
        // Add event listeners here
    }
}