const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role : {
        type: String,
        required: true,
    },
    instrument: {
        type: String,
        required: true,
    },
} , {
    timestamps: true,
});

const User = mongoose.model('User' , userSchema);

module.exports = User;