const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const {Server} = require('socket.io');
const cors = require('cors');
const path = require('path');
const userRoutes = require("./routes/userRoutes");
const songRoutes = require("./routes/songRoutes");

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

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

mongoose.connect("mongodb+srv://shanityerushalmi9:hCjFlo4Tpv1Pfjr4@cluster0.vzgy8hp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log('Connected to MongoDB.');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB -', err);
    });

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const userSockets = new Map(); // A map to track socket IDs and roles .
/*
 * A global variable to indicate if there is rehearsal session going on .
 * If there is - it holds the current song , else - null .
 */
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

        // Check if the admin has disconnected .
        const role = userSockets.get(socket.id);
        userSockets.delete(socket.id);

        if (role === 'admin') {
            global.currentLiveSession = null;
            io.emit('adminDisconnected');
        }
    });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
