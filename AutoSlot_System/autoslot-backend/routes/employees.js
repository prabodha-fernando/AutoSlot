const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// POST /api/employees - Creates a new employee
router.post('/', async (req, res) => {
    const { name, age, contactNumber, NIC, emailAddress, password, role } = req.body;
    try {
        let employee = await Employee.findOne({ $or: [{ emailAddress }, { NIC }] });
        if (employee) {
            return res.status(400).json({ msg: 'Employee with that email or NIC already exists' });
        }
        employee = new Employee({ name, age, contactNumber, NIC, emailAddress, password, role });
        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/employees - Fetches all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().select('-password');
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/employees/:id - Deletes an employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        await employee.deleteOne();
        res.json({ msg: 'Employee removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT /api/employees/:id - Updates an employee
router.put('/:id', async (req, res) => {
    const { name, age, contactNumber, NIC, emailAddress, role, password } = req.body;
    try {
        let employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        employee.name = name;
        employee.age = age;
        employee.contactNumber = contactNumber;
        employee.NIC = NIC;
        employee.emailAddress = emailAddress;
        employee.role = role;
        
        // --- MODIFIED: Only update password if a non-empty one is provided ---
        if (password && password.length > 0) {
            employee.password = password;
        }

        await employee.save();
        res.json(employee);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

