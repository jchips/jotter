import { useState, createContext } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { clearToken } from '@/util/authUtil';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (email, password) => {
    const encodedLogin = Buffer.from(`${email}:${password}`, 'utf-8').toString(
      'base64'
    );
    return encodedLogin;
  };

  const logout = () => {
    setIsLoggedIn(false);
    clearToken();
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export { AuthContext };
