const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function authenticateToken(req, res, next) {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) return res.status(401).json({ message: 'Missing token' });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findByPk(decoded.id);
		next();
	} catch (err) {
		console.error('Auth error:', err);
		res.status(403).json({ message: 'Invalid token' });
	}
}

module.exports = authenticateToken;