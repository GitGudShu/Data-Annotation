const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function googleRegister(req, res) {
    const { nom, prenom, email, avatar } = req.body;

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
                avatar: avatar || null,
                role: 'annotator'
            });
            console.log(`New user created: ${email}`);
            return res.json({ message: 'created', userId: user.id });
        }

    } catch (err) {
        console.error('Error in googleRegister:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

async function register(req, res) {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            console.log(`User already exists: ${email}`);
            return res.json({ message: 'already exists', userId: user.id });
        }

        let avatarUrl = null;
        if (req.file) {
            avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
        }

        user = await User.create({
            nom: lastName,
            prenom: firstName,
            email,
            password,
            avatar: avatarUrl,
            role: 'annotator'
        });

        console.log(`New user created: ${email}`);
        return res.json({ message: 'created', userId: user.id });
    } catch (err) {
        console.error('Error in register:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

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

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log()
            return res.status(400).json({ message: 'Missing email or password' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        return res.json({ token });
    } catch (err) {
        console.error('Error in login:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const { nom, prenom, email } = req.body;

        let updateData = { nom, prenom, email };

        if (req.file) {
            const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
            updateData.avatar = avatarUrl;
        }

        const [updatedRowsCount] = await User.update(updateData, { where: { id: userId } });

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findOne({ where: { id: userId } });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: 'Internal server error' });        
    }

};

async function updatePassword(req, res) {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password === 'GOOGLE_AUTH') {
            return res.status(403).json({ message: 'Cannot change password for a Google account' });
        }

        const { currentPassword, newPassword } = req.body;

        if (currentPassword !== user.password) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    googleRegister,
    loginWithGoogle,
    register,
    login,
    updateUser,
    updatePassword
};