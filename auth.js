const router = require('express').Router();
const User = require('./models/User'); // Update the path as necessary
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticateToken = require('./middleware');

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret'; 
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: "User created successfully", user });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    try {
        // req.user.userId should contain the user's ID from the token
        const user = await User.findById(req.user.userId).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
