const express = require('express');
const router = express.Router();
const VehicleLog = require('../models/VehicleLog');

// GET /api/vehicles - Get all vehicle logs
router.get('/', async (req, res) => {
    try {
        const logs = await VehicleLog.find().sort({ entryTime: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET /api/vehicles/inside - Get vehicles currently inside
router.get('/inside', async (req, res) => {
    try {
        const vehicles = await VehicleLog.find({ status: 'Inside' }).sort({ entryTime: -1 });
        res.json(vehicles);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST /api/vehicles/entry - Record a new vehicle entry
router.post('/entry', async (req, res) => {
    try {
        const newEntry = new VehicleLog(req.body);
        const entry = await newEntry.save();
        res.json(entry);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PUT /api/vehicles/exit/:id - Mark a vehicle as exited
router.put('/exit/:id', async (req, res) => {
    try {
        const updatedLog = await VehicleLog.findByIdAndUpdate(
            req.params.id,
            { status: 'Exited', exitTime: Date.now() },
            { new: true }
        );
        if (!updatedLog) return res.status(404).json({ msg: 'Vehicle log not found' });
        res.json(updatedLog);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;