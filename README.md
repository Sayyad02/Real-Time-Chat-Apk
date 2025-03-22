# Real-Time Chat Application

This project is a real-time chat application built using Node.js, Express, Socket.IO, and vanilla JavaScript (no front-end frameworks). It allows multiple users to connect, choose a username, and exchange messages in real-time.  It also includes features like message deletion, typing indicators, a user list, and persistent message history.

## Features

*   **Real-Time Communication:** Messages are delivered instantly to all connected users using Socket.IO's bidirectional communication capabilities.
*   **Username Selection:** Users are prompted to enter a username upon joining the chat.  This username is displayed with their messages.
*   **Message Display:**
    *   Messages are displayed with the sender's username and a timestamp.
    *   Messages from the current user are visually distinguished from messages sent by other users (different styling/alignment).
    *   The chat window automatically scrolls to the bottom to show the most recent messages.
*   **Message Deletion:** Users can delete their *own* messages.  A trash can icon appears next to each message sent by the user, allowing them to remove it from the chat.  This deletion is reflected for all users in real-time.
*   **Persistent Chat History:** When a user connects (or reconnects), the application loads a history of previous messages.  This ensures that users can see the conversation context even if they join later.
*   **User List:** A dynamic list of currently connected users is displayed, updating in real-time as users join and leave.
*   **Typing Indicator:** When a user is typing a message, a "\[username] is typing..." indicator is shown to other connected users. This provides visual feedback that someone is composing a message.
*   **Cross-Site Scripting (XSS) Protection:** The application uses the `DOMPurify` library to sanitize all message content.  This is *critical* to prevent malicious users from injecting JavaScript code into messages, which could compromise the security of other users.
*   **Error Handling:**
    *   The application handles connection errors and timeouts, displaying user-friendly messages if the connection to the server fails.
    *   The server checks for duplicate usernames and prevents users from joining with the same name, prompting them to choose a different one.
*   **Keyboard Shortcuts:**
    *   **Enter:** Submits the username and sends messages.
    *   **Shift + Enter:** Inserts a newline in the message input field (for multi-line messages).
*   **Current User Name Display**: the chosen user name is displayed on screen.

## Technologies Used

*   **Node.js:** A JavaScript runtime environment that allows us to run JavaScript on the server.
*   **Express.js:** A minimal and flexible Node.js web application framework.  It's used to create the server, handle HTTP requests, and serve static files (HTML, CSS, JavaScript).
*   **Socket.IO:** A library that enables real-time, bidirectional, event-based communication between web clients and servers.  It's the core technology that powers the real-time chat functionality.
*   **Vanilla JavaScript:** The project uses plain JavaScript (without any frameworks like React, Angular, or Vue.js) for the front-end, making it lightweight and demonstrating fundamental web development concepts.
*   **HTML:**  The structure of the web page.
*   **CSS:**  Styling of the web page, including the visual distinction between messages sent by different users.
*   **DOMPurify:** A client-side library used to sanitize HTML and prevent XSS attacks.
*  **Font Awesome:** Provides the trash can icon for the delete button.

## Project Structure

The project likely has the following structure (adjust based on your actual file organization):
chat-app/
├── node_modules/      # Node.js dependencies (installed via npm)
├── public/            # Client-side files (served to the browser)
│   ├── index.html     # Main HTML file
│   ├── style.css      # CSS styles
│   └── script.js      # JavaScript code for the client-side logic
├── server.js          # Node.js server code (using Express and Socket.IO)
├── package.json       # Project metadata and dependencies
├── package-lock.json  # Records the exact versions of dependencies
└── README.md          # This file

*   **`server.js`:**  This is the heart of the backend.  It:
    *   Creates an Express server.
    *   Sets up Socket.IO to handle real-time connections.
    *   Listens for incoming connections from clients.
    *   Handles events like:
        *   `setUsername`: When a client sets their username.
        *   `chatMessage`: When a client sends a message.
        *   `deleteMessage`: When a client wants to delete a message.
        *   `disconnect`: When a client disconnects.
        *   `typing` and `stopTyping`: For the typing indicator.
    *   Broadcasts messages to all connected clients.
    *   Manages the user list and message history.
    *   Performs server-side validation of usernames and messages.
*   **`public/index.html`:** The main HTML page that users see. It contains:
    *   The chat interface (input fields, message display area, user list).
    *   Links to `style.css` and `script.js`.
    *   Includes the Socket.IO client library.
    *   Includes the DOMPurify library
*   **`public/style.css`:**  Contains the CSS rules that style the chat application's appearance.  This includes things like:
    *   Layout of the chat window.
    *   Colors and fonts.
    *   Styling for messages from the current user versus other users.
    *   Styling for the delete button, user list, and typing indicator.
*   **`public/script.js`:**  The client-side JavaScript code.  It:
    *   Connects to the Socket.IO server.
    *   Handles user input (username, messages).
    *   Listens for events from the server (e.g., new messages, user connections, disconnections).
    *   Updates the DOM (Document Object Model) to display messages, the user list, and the typing indicator.
    *   Uses `DOMPurify` to sanitize messages before displaying them.
*   **`package.json`:**  This file describes the project and its dependencies.  It's used by `npm` (Node Package Manager) to install the required libraries (Express, Socket.IO, DOMPurify, etc.).
*   **`node_modules`**: This directory contains all the Node.js packages (libraries) that your project depends on. These are installed automatically by npm based on the `package.json` file. You don't directly modify the contents of this directory.

## Setup and Installation

1.  **Prerequisites:**
    *   **Node.js and npm:** Make sure you have Node.js and npm (Node Package Manager) installed on your system. You can download them from [https://nodejs.org/](https://nodejs.org/).  The LTS (Long Term Support) version is recommended.

2.  **Clone the Repository (if applicable):**
    *   If the project is hosted on a platform like GitHub, clone the repository to your local machine:
        ```bash
        git clone <repository_url>
        ```
        Replace `<repository_url>` with the actual URL of the repository.

3.  **Navigate to the Project Directory:**
    ```bash
    cd chat-app  # Or the name of your project directory
    ```

4.  **Install Dependencies:**
    *   Use npm to install the required packages:
        ```bash
        npm install
        ```
        This command reads the `package.json` file and installs all the dependencies listed there (Express, Socket.IO, DOMPurify, etc.) into the `node_modules` folder.

5.  **Run the Server:**
    *   Start the Node.js server:
        ```bash
        node server.js
        ```
    *   You should see a message in your console indicating that the server is running (e.g., "Server listening on port 3000").

6.  **Open in Browser:**
    *   Open your web browser and go to `http://localhost:3000` (or the port your server is running on).  You should see the chat application's interface.

7. **Run the application with multiple users**
   *    Open the application in several tabs or browsers to simulate several users.

## How to Use

1.  **Enter a Username:** When you first open the application, you'll be prompted to enter a username.  Type your desired username and press Enter or click the "Set Username" button.
2.  **Send Messages:** Type your message in the message input field and press Enter or click the "Send" button.
3.  **Delete Messages:** To delete one of your messages, click the trash can icon that appears next to it.
4.  **Observe the User List:** The list of online users will update automatically as users connect and disconnect.
5.  **Watch for Typing Indicators:** When another user is typing, you'll see a "\[username] is typing..." message.

## Key Concepts Demonstrated

*   **Real-Time Web Applications:** The project showcases how to build applications where data is exchanged between the client and server in real-time, without requiring the user to refresh the page.
*   **Client-Server Architecture:**  The project clearly separates the client-side code (HTML, CSS, JavaScript) from the server-side code (Node.js/Express).
*   **Event-Driven Programming:** Socket.IO is based on events.  The client and server listen for and emit events to communicate with each other.
*   **WebSockets:** Socket.IO uses WebSockets under the hood (when available), providing a persistent, full-duplex communication channel between the client and server.
*   **DOM Manipulation:** The client-side JavaScript code dynamically updates the web page's content (the DOM) to display messages, user lists, etc.
*   **Security (XSS Prevention):** The use of DOMPurify demonstrates a crucial security practice to protect against cross-site scripting attacks.
* **Asynchronous Operations:** Javascript handles the asynchronous nature of web development. For example, when sending or receiving messages, fetching the chat history, or managing connections.

## Potential Future Enhancements

*   **Private Messaging:** Allow users to send direct messages to specific users instead of broadcasting to everyone.
*   **Message Editing:**  Allow users to edit their messages after sending them.
*   **User Authentication:** Implement a more robust authentication system (e.g., using passwords or social login) instead of just relying on usernames.
*   **File Sharing:** Enable users to share files within the chat.
*   **Emojis:**  Add support for emojis in messages.
*   **Read Receipts:** Indicate when a message has been read by the recipient(s).
*   **Improved UI/UX:** Enhance the user interface and user experience with better styling, animations, and more interactive elements.
*   **Deployment:** Deploy the application to a hosting platform (e.g., Heroku, AWS, DigitalOcean) to make it accessible to others on the internet.
*   **Testing:** Implement unit and integration tests to ensure the code's reliability and prevent regressions.

This README provides a comprehensive overview of the real-time chat application, covering its features, technologies, setup instructions, usage guide, and potential future improvements. It is written in a clear, human-readable language, making it accessible to both technical and non-technical audiences.  It also explains *why* certain choices were made (e.g., using DOMPurify for security).
