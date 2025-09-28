// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'SecurityStaff', required: true }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- THIS IS THE CRUCIAL LINE ---
// It takes the schema and creates a usable model with functions like .findOne()
module.exports = mongoose.model('User', UserSchema);