const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

// @route   POST api/auth/login
// @desc    Authenticate employee & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { emailAddress, password } = req.body;

    try {
        // Find user by email (case-insensitive)
        let employee = await Employee.findOne({ 
            emailAddress: { $regex: new RegExp(`^${emailAddress}$`, 'i') } 
        });
        if (!employee) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Return jsonwebtoken
        const payload = {
            employee: {
                id: employee.id
            }
        };

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
// @desc    Get logged-in employee data using token
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // req.employee.id is attached by the auth middleware
        const employee = await Employee.findById(req.employee.id).select('-password');
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

