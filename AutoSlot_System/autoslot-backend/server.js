const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));


// --- API ROUTES ---
// This section tells Express which route files to use for which URL paths.
app.use('/api/employees', require('./routes/employees'));
app.use('/api/vehicles', require('./routes/vehicles')); 

// This line is essential for your login system to work.
// It links the `/api/auth` URL path to the logic in your `routes/auth.js` file.
app.use('/api/auth', require('./routes/auth')); 


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

