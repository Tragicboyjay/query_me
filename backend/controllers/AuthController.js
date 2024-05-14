// Authentication Controller 
const bcrypt = require('bcrypt');
const User = require('../Models/UserModel');

async function createUser(req,res) {
    const { username, password, email } = req.body;

    try {
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            userLogger.info('Email already exists');
            return res.status(400).json({ message: 'Email already exists' });
        }

        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            userLogger.info('User name already exists')
            return res.status(400).json({ message: 'User name already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            password: hashedPassword,
            email: email
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', createdUser: newUser });
        // userLogger.info('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
        // userLogger.error('Error creating user');
    };
};

const authenticateUser = async function (req,res) {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            // userLogger.info('The email or password you\'ve entered is incorect');
            return res.status(401).json({ message: 'The email or password you\'ve entered is incorect' });
        }

        const existingUserPassword = existingUser.password

        const passwordMatch = await bcrypt.compare(password,existingUserPassword);

        if (!passwordMatch) {
            userLogger.info('The email or password you\'ve entered is incorect');
            return res.status(401).json({ message: 'The email or password you\'ve entered is incorect' });
        }

        // const jwtTotken = jwt.sign({id: existingUser.userName}, process.env.JWT_SECRET_KEY);

        res.status(200).json({ message: 'Login successful'});
        // res.status(200).json({ message: 'Login successful', token: jwtTotken });
        // userLogger.info('Login successful');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
        // userLogger.error('Error creating user');
    };
};

module.exports = {
    createUser,
    authenticateUser
}; 