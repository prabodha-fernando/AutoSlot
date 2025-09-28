const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcryptjs');

const EmployeeSchema = new mongoose.Schema({
    // Note: We don't define employeeID here, the plugin will add it
    name: { type: String, required: true },
    age: { type: Number, required: true },
    contactNumber: { type: String, required: true },
    NIC: { type: String, required: true, unique: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
}, { 
    timestamps: true,
    // --- ADDED THIS SECTION ---
    // This ensures that when the document is converted to JSON (e.g., sent in an API response),
    // the virtual properties like 'employeeID' are included.
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Hash password before saving
EmployeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Attach the auto-increment plugin to the schema
EmployeeSchema.plugin(AutoIncrement, {
    inc_field: 'employeeID_num', // A field to hold the numeric value of the ID
    id: 'employee_counter',      // An ID for the counter in the database
    start_seq: 10001,            // Start counting from 10001
});

// A virtual field to create the formatted "E10001" ID
EmployeeSchema.virtual('employeeID').get(function() {
    return `E${this.employeeID_num}`;
});

module.exports = mongoose.model('Employee', EmployeeSchema);
