// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// helper: parse JWT payload (safe)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // تحقق أولي عند تحميل الـ app
    const savedToken = localStorage.getItem('token');

    // نظّف أي قيمة قديمة
    if (localStorage.getItem('authToken')) {
      localStorage.removeItem('authToken');
    }

    if (savedToken && savedToken !== 'undefined') {
      setToken(savedToken);
      setIsLoggedIn(true);
      const payload = parseJwt(savedToken);
      const checkAdmin =
        payload &&
        (payload.isAdmin === true ||
          payload.role === 'admin' ||
          (payload.email && payload.email.toLowerCase() === 'admin@gmail.com'));
      setIsAdmin(!!checkAdmin);
    } else {
      // تأكد من تنظيف التخزين إن لم يوجد توكن صالح
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      setToken(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  // login يمكن استدعاؤه مع توكن أو بدون (يرجع لlocalStorage)
  const login = (newToken) => {
    const tokenToUse = newToken || localStorage.getItem('token');
    if (!tokenToUse || tokenToUse === 'undefined') {
      console.error('❌ Token is invalid:', tokenToUse);
      return;
    }

    // احفظ التوكن وحدّث الحالة
    localStorage.setItem('token', tokenToUse);
    localStorage.setItem('isLoggedIn', 'true');
    setToken(tokenToUse);
    setIsLoggedIn(true);

    const payload = parseJwt(tokenToUse);
    const checkAdmin =
      payload &&
      (payload.isAdmin === true ||
        payload.role === 'admin' ||
        (payload.email && payload.email.toLowerCase() === 'admin@gmail.com'));
    setIsAdmin(!!checkAdmin);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('isLoggedIn');
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
