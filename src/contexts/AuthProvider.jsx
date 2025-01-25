import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Buffer } from 'buffer';
import { AuthContext } from './AuthContext';
import { setConfigs } from '@/reducers';
import { setToken, clearToken } from '@/util/authUtil';
import { setLocalConfigs } from '@/util/configUtil';
import api from '@/util/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  // authenticates user on page reload
  useEffect(() => {
    const authenticate = async () => {
      try {
        let res = await api.authenticate();
        if (res.data) {
          setUser(res.data);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Failed to authenticate user ' + err);
        setUser(null);
        setIsLoggedIn(false);
        // logout()?
      }
    };
    authenticate();
  }, []);

  /**
   * Logs user in
   * Add token to localStorage
   * Creates a cookie to preserve user info until token expires
   * Sets/stores the user's configurations
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Object} - Response object from server
   */
  const login = async (email, password) => {
    const encodedLogin = Buffer.from(`${email}:${password}`, 'utf-8').toString(
      'base64'
    );
    let res;
    try {
      axios.defaults.headers.common['Authorization'] = `Basic ${encodedLogin}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      let requestUrl = `${import.meta.env.VITE_SERVER}/jotter/login`;
      res = await axios.post(requestUrl, { withCredentials: true });
      setUser(res.data.user);
      setToken(res.data.token);
      setIsLoggedIn(true);
      let uConfigs = await api.getConfigs();
      dispatch(setConfigs(uConfigs.data));
      setLocalConfigs(uConfigs.data);
    } catch (err) {
      console.error(err);
      res = err;
    }
    return res;
  };

  // Logs user out
  // Clears cookie
  // Clears token from local storage
  const logout = async () => {
    try {
      let requestUrl = `${import.meta.env.VITE_SERVER}/jotter/logout`;
      await axios.post(requestUrl, {}, { withCredentials: true });
      setUser(null);
      setIsLoggedIn(false);
      clearToken();
      delete axios.defaults.headers.common['Authorization'];
    } catch (err) {
      console.error('Failed to log user out:', err);
    }
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
