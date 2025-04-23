const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const userRoutes = require("./routes/userRoutes");
const songRoutes = require("./routes/songRoutes");

require('dotenv').config();

const app = express();
app.use(express.json());

// Define the allowed origin(s) - Update this with your frontend URL
const allowedOrigin = "https://ja-moveo-web-app.vercel.app";  // Replace with your actual frontend URL

// Set CORS for API routes
const corsOptions = {
    origin: allowedOrigin,  // Allow only your frontend URL
    methods: ["GET", "POST"],
    credentials: true  // Allow cookies to be sent with requests (if needed)
};

app.use(cors(corsOptions));  // Apply CORS middleware globally for all API routes

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/song", songRoutes);

// Serve the React app for any unknown routes
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const server = http.createServer(app);

// MongoDB connection
mongoose.connect("mongodb+srv://shanityerushalmi9:hCjFlo4Tpv1Pfjr4@cluster0.vzgy8hp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log('Connected to MongoDB.');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB -', err);
    });

// Socket.IO setup with CORS handling
const io = new Server(server, {
    cors: {
        origin: allowedOrigin,  // Allow only your frontend URL to connect
        methods: ["GET", "POST"],
        credentials: true,  // Allow cookies to be sent with socket requests (if needed)
    }
});

const userSockets = new Map();  // A map to track socket IDs and roles

// A global variable to indicate if there is a rehearsal session going on
global.currentLiveSession = null;

io.on('connection', (socket) => {
    console.log(`User connected - ${socket.id}.`);

    socket.on('registerUser', ({ role }) => {
        userSockets.set(socket.id, role);
    });

    socket.on('adminSongSelected', (song) => {
        global.currentLiveSession = song;
        io.emit('navigateToLive', song);
    });

    socket.on('adminQuit', () => {
        global.currentLiveSession = null;
        io.emit('adminDisconnected');
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected - ${socket.id}.`);

        // Check if the admin has disconnected
        const role = userSockets.get(socket.id);
        userSockets.delete(socket.id);

        if (role === 'admin') {
            global.currentLiveSession = null;
            io.emit('adminDisconnected');
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
