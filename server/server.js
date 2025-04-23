const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const {Server} = require('socket.io');
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const songRoutes = require("./routes/songRoutes");

require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors());
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST"],
};
app.use(cors(corsOptions));

app.use("/api/user", userRoutes);
app.use("/api/song", songRoutes);

const server = http.createServer(app);

mongoose.connect(process.env.MONGO_URL)
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
