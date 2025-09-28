const express = require('express');
const router = express.Router();
const VehicleLog = require('../models/VehicleLog');

// GET /api/reports/vehicle-type-analysis
router.get('/vehicle-type-analysis', async (req, res) => {
    try {
        const analysis = await VehicleLog.aggregate([
            { $group: { _id: '$vehicleType', count: { $sum: 1 } } }
        ]);
        
        const result = analysis.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        res.json(result);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET /api/reports/security-activity - Last 24 hours
router.get('/security-activity', async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const activity = await VehicleLog.find({
            entryTime: { $gte: twentyFourHoursAgo }
        }).sort({ entryTime: -1 });

        res.json(activity);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;