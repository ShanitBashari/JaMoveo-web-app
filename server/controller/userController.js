const User = require('../models/User');
const bcrypt = require("bcrypt");

module.exports.registerHandler = async (req, res) => {
    try {
        const {username, password, role, instrument} = req.body;

        const usernameCheck = await User.findOne({username});
        if (usernameCheck) {
            return res.status(400).send('Username already in use .');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            password:hashedPassword,
            role,
            instrument
        })

        return res.status(200).end();
    } catch (error) {
        return res.status(500).send('Server error .');
    }
};

module.exports.loginHandler = async (req, res) => {
    try {
        const {username, password} = req.body

        const user = await User.findOne({username});
        if (!user) {
            return res.status(400).send('Incorrect Username or Password .');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send('Incorrect Username or Password .');
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send('Server error .');
    }
};

module.exports.sessionHandler = (req, res) => {
    if (currentLiveSession) {
        res.json({
            active: true,
            song: currentLiveSession,
        });
    } else {
        res.json({
            active: false,
        });
    }
};