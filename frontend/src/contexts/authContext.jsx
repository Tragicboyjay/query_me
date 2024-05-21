// AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginUser = (userData) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const updateUsername = (newUsername) => {
    const updatedUser = { ...user, username: newUsername };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
};

const updateEmail = (newEmail) => {
    const updatedUser = { ...user, email: newEmail };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
};

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, updateEmail, updateUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Specify that children is required and must be a node
};
