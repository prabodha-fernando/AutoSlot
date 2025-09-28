const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // The token format is "Bearer <token>". We need to remove "Bearer ".
    const tokenString = token.split(' ')[1];
    if (!tokenString) {
        return res.status(401).json({ msg: 'Token format is invalid' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
        req.employee = decoded.employee;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

