const User = require('../models/user.model');

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

module.exports = {
	googleRegister,
};