const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const SecurityOfficerSchema = new mongoose.Schema({
    officerID: { type: Number },
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    shift: { type: String, enum: ['Day', 'Night'], default: 'Day' }
}, { timestamps: true });

SecurityOfficerSchema.plugin(AutoIncrement, { inc_field: 'officerID', id: 'officer_counter', start_seq: 10001 });

module.exports = mongoose.model('SecurityOfficer', SecurityOfficerSchema);
