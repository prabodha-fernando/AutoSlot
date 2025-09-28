const express = require('express');
const router = express.Router();
const SecurityOfficer = require('../models/SecurityOfficer');

// GET / - Get all officers
router.get('/', async (req, res) => {
    try {
        const officers = await SecurityOfficer.find().sort({ createdAt: -1 });
        res.json(officers);
    } catch (err) { res.status(500).send('Server Error'); }
});

// POST / - Create a new officer
router.post('/', async (req, res) => {
    try {
        const newOfficer = new SecurityOfficer(req.body);
        await newOfficer.save();
        res.status(201).json(newOfficer);
    } catch (err) { res.status(500).send('Server Error'); }
});

// PUT /:id - Update an officer
router.put('/:id', async (req, res) => {
    try {
        const officer = await SecurityOfficer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!officer) return res.status(404).json({ msg: 'Officer not found' });
        res.json(officer);
    } catch (err) { res.status(500).send('Server Error'); }
});

// DELETE /:id - Delete an officer
router.delete('/:id', async (req, res) => {
    try {
        const officer = await SecurityOfficer.findByIdAndDelete(req.params.id);
        if (!officer) return res.status(404).json({ msg: 'Officer not found' });
        res.json({ msg: 'Officer removed' });
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
