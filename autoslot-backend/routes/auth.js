const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const auth = require('../middleware/auth');

// @route   POST api/auth/login
// @desc    Authenticate system user & get token
router.post('/login', async (req, res) => {
    const { emailAddress, password } = req.body;
    try {
        let user = await User.findOne({ 
            emailAddress: { $regex: new RegExp(`^${emailAddress}$`, 'i') } 
        });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create the payload with a 'user' object to match the middleware
        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/me
// @desc    Get logged in user data
// @access  Private (requires token)
router.get('/me', auth, async (req, res) => {
    try {
        // This works because the middleware correctly sets req.user.id
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

