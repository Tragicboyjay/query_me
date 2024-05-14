const User = require("../Models/UserModel");
const bcrypt = require('bcrypt');


// User Routes
const deleteUser = async function(req,res) {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        const currentPassword = req.body.password
    
        const correctPassword = await bcrypt.compare(currentPassword, user.password)
    
        if (!correctPassword) {
            return res.status(401).json({ message: 'Current password is incorrect. Please try again.' });
        }
        
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }     
};

module.exports = { deleteUser };