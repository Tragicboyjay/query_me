// Authentication Controller 
const bcrypt = require('bcrypt');
const User = require('../Models/UserModel');
const jwt = require('jsonwebtoken')
require('dotenv').config();

async function createUser(req,res) {
    const { username, password, email } = req.body;

    try {
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            
            return res.status(400).json({ message: 'Email already exists' });
        }

        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
        
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            password: hashedPassword,
            email: email
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: {
            username: newUser.username,
            email: newUser.email,
            id: newUser._id,
            token: generateToken(newUser._id)
        } });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    };
};

const authenticateUser = async function (req,res) {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {

            return res.status(401).json({ message: 'The email or password you\'ve entered is incorect' });
        }

        const existingUserPassword = existingUser.password

        const passwordMatch = await bcrypt.compare(password,existingUserPassword);

        if (!passwordMatch) {

            return res.status(401).json({ message: 'The email or password you\'ve entered is incorect' });
        }

        res.status(200).json({ message: 'Login successful', 
        user: {
            username: existingUser.username,
            email: existingUser.email,
            id: existingUser._id,
            token: generateToken(existingUser._id)
        }});

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });

    };
};

function generateToken(id) {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = {
    createUser,
    authenticateUser
}; 