document.addEventListener("DOMContentLoaded", function () {
    if (typeof io === "undefined") {
        alert("Socket.IO not found! Make sure your server is running.");
        return;
    }

    const socket = io('http://localhost:3000'); // Change port if needed

    let currentUsername = "";

    // DOM Elements
    const usernameForm = document.getElementById("username-form");
    const usernameInput = document.getElementById("username-input");
    const setUsernameButton = document.getElementById("set-username-button");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const chatMessages = document.querySelector(".chat-messages");
    const currentUserDisplayName = document.getElementById("current-user-name");
    const recentChats = document.querySelector(".recent-chats");
    const messagesContainer = document.querySelector(".chat-messages"); //  Get the chat messages container


    // Set Username
    function setUsername() {
        const enteredUsername = usernameInput.value.trim();
        if (!enteredUsername) {
            alert("Please enter a valid username.");
            return;
        }

        currentUsername = enteredUsername;
        currentUserDisplayName.textContent = currentUsername;
        socket.emit("login", currentUsername);

        // Hide username form and show chat
        usernameForm.style.display = "none";
        document.querySelector(".chat-window").style.display = "block";
    }

    // Send Message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) {
            alert("Cannot send an empty message.");
            // Clear and resize the input:
            messageInput.value = '';        // Clear the text
            messageInput.style.height = '';  // Reset height to auto (important!)
            messageInput.rows = 1;           // Set to a single row (or your desired minimum)
            return;
        }
        if (!currentUsername) {
            alert("Please set a username first.");
            return;
        }

        const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Emit message to server
        socket.emit("chat message", { text: message, sender: currentUsername });

        // Display message immediately on sender's side
        displayMessage(message, true, timestamp, currentUsername);

        messageInput.value = ""; // Clear input field
        messageInput.style.height = ""; //Reset the height of message input
    }

    // Display Message
    function displayMessage(message, isCurrentUser, timestamp, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", isCurrentUser ? "message-sender-me" : "message-sender-other");

        messageDiv.innerHTML = `
            <div class="sender-name">${sender}</div>
            <div class="message-content">${message}</div>
            <div class="timestamp">${timestamp}</div>
        `;
        chatMessages.appendChild(messageDiv);
        // Scroll to the bottom to show the new message:
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    }

    // Handle Typing Indicator
    messageInput.addEventListener("input", () => {
        socket.emit("typing", currentUsername);
    });

    socket.on("typing", (user) => {
        document.querySelector(".receiver-name h2").textContent = `${user} is typing...`;
        setTimeout(() => {
            document.querySelector(".receiver-name h2").textContent = "Chat";
        }, 2000);
    });

    // Handle Incoming Messages
    socket.on("chat message", (data) => {
        displayMessage(data.text, data.sender === currentUsername, data.time, data.sender);
    });


    // Show Online Users
    socket.on("user list", (users) => {
        recentChats.innerHTML = users.map(user =>
            `<div class="recent-chat-item">${user}</div>`).join('');
    });

    // Show Message Read Status -  Modified to show on the *correct* timestamp.
    chatMessages.addEventListener("mouseenter", () => {
        socket.emit("message seen", currentUsername);
    });

    socket.on("message status", (data) => {
        // Find *all* messages sent by the user who just saw the messages,
        // and update their timestamps.  This is much more robust.
        const messages = chatMessages.querySelectorAll('.message');
        messages.forEach(messageDiv => {
            const senderNameDiv = messageDiv.querySelector('.sender-name');
            const timestampDiv = messageDiv.querySelector('.timestamp');

            //Check if the message element exists and the text content matches data user
            if(senderNameDiv && timestampDiv && senderNameDiv.textContent === data.sender){
                // Check if the timestamp already contains "Seen"
                if (!timestampDiv.textContent.includes("Seen")) {
                    timestampDiv.textContent = `${timestampDiv.textContent} Seen by ${data.user}`;
                 }
            }
        });
    });


    // Event Listeners
    setUsernameButton.addEventListener("click", setUsername);
    usernameInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setUsername();
        }
    });

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    //Auto-resize the message input box
    messageInput.addEventListener("input", function() {
        this.style.height = 'auto';  // Reset height
        this.style.height = (this.scrollHeight) + 'px'; // Set to scrollHeight
    });
});