const jwt = require('jsonwebtoken');
const User = require("../Models/UserModel");

const protect = async function(req, res, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            // Check if req.user exists before accessing its properties
            if (!req.user) {
                return res.status(401).json({ message: "Not Authorized" });
            }

            if (!req.params.id) {
                return res.status(400).json({ message: 'Bad Request: User ID is required' });
            }

            if (req.params.id !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Forbidden: You are not authorized to perform this action' });
            }

            next();
            
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Not Authorized" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not Authorized, no token" });
    }
};

module.exports = { protect };
