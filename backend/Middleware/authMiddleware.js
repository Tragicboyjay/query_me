const jwt = require('jsonwebtoken');
const User = require("../Models/UserModel");

const protect = async function( req, res, next) {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.process.env.TOKEN_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
            
        } catch (error) {
            console.log(error)
            res.status(401).json({message: "Not Authorized"});
        }
    }

    if (!token) {
        res.status(401).json({message: "Not Authorized, no token"});
    }


    
};

module.exports = { protect }