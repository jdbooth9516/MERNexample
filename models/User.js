const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        uniquie: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    data: {
        type: Date,
        defualt: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema);