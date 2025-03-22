const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sanitizeHtml = require('sanitize-html'); // Correct server-side sanitization

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files

const users = {}; // Store online users

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    let loggedInUser = null;

    // Handle Login
    socket.on('login', (username) => {
        if (!username || username.trim() === '' || username.length > 20) {
            socket.emit('login error', 'Invalid username.');
            return;
        }

        const cleanUsername = sanitizeHtml(username).toLowerCase();

        if (users[cleanUsername]) {
            socket.emit('login error', 'Username already taken.');
            return;
        }

        users[cleanUsername] = { socketId: socket.id };
        loggedInUser = cleanUsername;

        console.log(`User logged in: ${cleanUsername}`);

        io.emit('user list', Object.keys(users)); // Update user list
        socket.emit('chat message', { sender: 'System', text: `Welcome, ${cleanUsername}!`, time: new Date().toLocaleTimeString() });
    });

    // Handle Chat Messages
    socket.on('chat message', (msg) => {
        if (!loggedInUser || !msg || !msg.text || msg.text.trim() === '' || msg.text.length > 500) {
            socket.emit('chat error', "Invalid message");
            return;
        }
    
        const cleanMsg = sanitizeHtml(msg.text);
        const messageToSend = {
            sender: loggedInUser,
            text: cleanMsg,
            time: new Date().toLocaleTimeString(),
        };
    
        console.log('Message received:', messageToSend);
        
        // Send message to all users (including sender)
        io.emit('chat message', messageToSend);
    });

    // Handle Typing Indicator
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });

    // Handle Message Read Receipts
    socket.on("message seen", (username) => {
        io.emit("message status", { user: username, status: "Seen" });
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (loggedInUser) {
            delete users[loggedInUser];
            io.emit('user list', Object.keys(users));
        }
    });

    // Handle Errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
