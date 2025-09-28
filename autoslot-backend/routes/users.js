const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST api/users - Register a new system user
router.post('/', async (req, res) => {
    const { name, emailAddress, password, role } = req.body;
    try {
        let user = await User.findOne({ emailAddress });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, emailAddress, password, role });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
