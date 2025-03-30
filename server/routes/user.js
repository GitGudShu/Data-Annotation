const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');

router.get('/me', authenticate, (req, res) => {
	const user = req.user;
	if (!user) return res.status(404).json({ message: 'User not found' });

	res.json({
		id: user.id,
		nom: user.nom,
		prenom: user.prenom,
		email: user.email,
		avatar: user.avatar,
		role: user.role,
		isGoogleUser: user.isGoogleUser
	});
});

module.exports = router;