const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SecurityStaff = require('../models/SecurityStaff');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { employeeId, username, password } = req.body;
    try {
        const staffMember = await SecurityStaff.findOne({ employeeId });
        if (!staffMember) {
            return res.status(404).json({ msg: 'Employee ID not found.' });
        }

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Username already exists.' });
        }

        user = new User({
            username,
            password,
            staffId: staffMember._id
        });

        await user.save();
        res.status(201).json({ msg: 'User registered successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;