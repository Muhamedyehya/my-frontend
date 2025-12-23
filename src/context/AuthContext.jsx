// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// ضع هنا إيميل الأدمن المصرّح (أو لاحقًا استخدم متغير بيئة)
const ADMIN_EMAIL = "admin@gmail.com";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // عند تحميل المكوّن نقرأ القيم من localStorage
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');

    if (savedToken && savedToken !== 'undefined') {
      setToken(savedToken);
      setIsLoggedIn(true);
      setEmail(savedEmail || null);
      setIsAdmin((savedEmail || '') === ADMIN_EMAIL);
    } else {
      // تنظف القيم إذا كانت غير صحيحة
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      // لا نمسح الايميل لأن العميل قد يريد تسجيل الخروج فقط
      setToken(null);
      setIsLoggedIn(false);
      setEmail(null);
      setIsAdmin(false);
    }
  }, []);

  // login: نقبل توكن وايميل (الايميل اختياري لأن الكود أحيانا يخزن الايميل قبل استدعاء login)
  const login = (newToken, newEmail) => {
    const tokenToUse = newToken || localStorage.getItem('token');
    const emailToUse = newEmail || localStorage.getItem('email');

    if (!tokenToUse || tokenToUse === 'undefined') {
      console.error('❌ Token is invalid:', tokenToUse);
      return;
    }

    // خزّن التوكن والايميل
    localStorage.setItem('token', tokenToUse);
    if (emailToUse) localStorage.setItem('email', emailToUse);
    localStorage.setItem('isLoggedIn', 'true');

    setToken(tokenToUse);
    setEmail(emailToUse || null);
    setIsLoggedIn(true);
    setIsAdmin((emailToUse || '') === ADMIN_EMAIL);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('isLoggedIn');
    setToken(null);
    setIsLoggedIn(false);
    setEmail(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, email, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
