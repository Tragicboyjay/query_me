const User = require("../Models/UserModel");
const bcrypt = require('bcrypt');

// log
const { userLogger } = require('./logger');


// User Routes
const deleteUser = async function(req,res) {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        const currentPassword = req.body.password
    
        const correctPassword = await bcrypt.compare(currentPassword, user.password)
    
        if (!correctPassword) {
            userLogger.info("Status code: 401, Message: 'User deletion unsuccessful: Current password is incorrect.'");
            return res.status(401).json({ message: 'Password is incorrect. Please try again.' });
        }
        
        await User.findByIdAndDelete(userId);

        userLogger.info("Status code: 200, Message: 'User deleted successfully'");
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
        userLogger.error("Status code: 500, Message: 'Error deleting user: Internal server error'");
    }     
};

const editUser = async function (req,res) {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        const currentPassword = req.body.password
    
        const correctPassword = await bcrypt.compare(currentPassword, user.password)
    
        if (!correctPassword) {
            userLogger.info(`Status code: 401, Message: 'Error editing user: Current password is incorrect. Please try again.'`);
            return res.status(401).json({ message: 'Current password is incorrect. Please try again.' });
        }
    
        const editField = req.params.field;
    
        const newValue = req.body.newValue;
    
        const editObject = {};

        switch (editField){
            case 'email':
                    const currentEmail = user.email

                    if (newValue === currentEmail) {
                        userLogger.info("Status code: 400, Message: 'No changes made: Value is the same as current email'");
                        return res.status(400).json({ message: 'Value is the same as current email' });
                    }

                    editObject['email'] = newValue;
                break;
            
            case 'username':
                const currentUserName = user.username;
                    
                if (newValue === currentUserName) {
                    userLogger.info("Status code: 400, Message: 'No changes made: Value is the same as current username'");
                    return res.status(400).json({ message: 'Value is the same as current username' });
                }

                editObject['username'] = newValue;
                break;
            
            case 'password':
                if (newValue === currentPassword) {
                    userLogger.info("Status code: 400, Message: 'No changes made: Value is the same as current password'");
                    return res.status(400).json({ message: 'Value is the same as current password' });
                }

                const newPassword = await bcrypt.hash(newValue, 10);
                
                editObject['password'] = newPassword;

                break;
            default:
                userLogger.error("Status code: 400, Message: 'Error editing user: Invalid action provided'");
                res.status(400).json({ message: 'Invalid action provided' });

        }

        await User.updateOne({ _id: userId }, { $set: editObject });
        userLogger.info(`Status code: 200, Message: '${editField} updated successfully'`);
        res.status(200).json({ message: `${editField} updated successfully` });
    } catch (error) {
        console.error(`Error updating ${editField} :`, error);
        userLogger.error(`Status code: 500, Message: 'Error editing user ${editField}: Internal server error'`);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { 
    deleteUser,
    editUser
};