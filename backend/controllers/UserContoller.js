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

const editUser = async function (req,res) {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        const currentPassword = req.body.password
    
        const correctPassword = await bcrypt.compare(currentPassword, user.password)
    
        if (!correctPassword) {
            return res.status(401).json({ message: 'Current password is incorrect. Please try again.' });
        }
    
        const editField = req.params.field;
    
        const newValue = req.body.newValue;
    
        const editObject = {};

        switch (editField){
            case 'email':
                    const currentEmail = user.email

                    if (newValue === currentEmail) {
                        return res.status(200).json({ message: 'Value is the same as current email, no changes made' });
                    }

                    editObject['email'] = newValue;
                break;
            
            case 'username':
                const currentUserName = user.username;
                    
                if (newValue === currentUserName) {
                    return res.status(200).json({ message: 'Value is the same as current user name, no changes made' });
                }

                editObject['username'] = newValue;
                break;
            
            case 'password':
                if (newValue === currentPassword) {
                    return res.status(200).json({ message: 'Value is the same as current password, no changes made' });
                }

                const newPassword = await bcrypt.hash(newValue, 10);
                
                editObject['password'] = newPassword;

                break;
            default:
                res.status(400).json({ message: 'Invalid action provided' });

        }

        await User.updateOne({ _id: userId }, { $set: editObject });
        res.status(200).json({ message: `${editField} updated successfully` });
    } catch (error) {
        console.error(`Error updating ${editField} :`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { 
    deleteUser,
    editUser
};