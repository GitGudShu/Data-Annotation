const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function googleRegister(req, res) {
	const { nom, prenom, email } = req.body;

	if (!email || !nom || !prenom) {
		console.warn('Missing data for Google registration');
		return res.status(400).json({ message: 'Missing required fields' });
	}

	try {
		let user = await User.findOne({ where: { email } });

		if (user) {
			console.log(`User already exists: ${email}`);
			return res.json({ message: 'already exists', userId: user.id });
		} else {
			user = await User.create({
				nom,
				prenom,
				email,
				password: 'GOOGLE_AUTH',
				role: 'annotator'
			});
			console.log(`New user created: ${email}`);
			return res.json({ message: 'created', userId: user.id });
		}
		
	} catch (err) {
		console.error('Error in googleRegister:', err);
		res.status(500).json({ message: 'Internal server error' });
	}
}

async function loginWithGoogle(req, res) {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ message: 'Missing email' });
	}

	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

		res.json({ token });
	} catch (err) {
		console.error('Error in loginWithGoogle:', err);
		res.status(500).json({ message: 'Internal server error' });
	}
}

module.exports = {
	googleRegister,
	loginWithGoogle
};