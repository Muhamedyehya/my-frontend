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

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Helper: تحدد لو الإيميل هو إيميل المشرف أو لو فيه دور محفوظ
  const checkIfAdmin = (mail) => {
    // إذا عايز تستخدم أكثر من إيميل admin أضفهم هنا أو اقرأ role من localStorage
    const adminEmails = ['admin@gmail.com'];
    if (!mail) return false;
    return adminEmails.includes(mail.toLowerCase());
  };

  useEffect(() => {
    // على بداية التشغيل نقرأ ما محفوظ في localStorage (توافق مع النسخ القديمة)
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');

    if (savedToken && savedToken !== 'undefined') {
      setToken(savedToken);
      setIsLoggedIn(true);
    } else {
      setToken(null);
      setIsLoggedIn(false);
      localStorage.removeItem('token');
    }

    if (savedEmail) {
      setEmail(savedEmail);
      setIsAdmin(checkIfAdmin(savedEmail));
    } else {
      setEmail(null);
      setIsAdmin(false);
    }
  }, []);

  // login: يدعم استدعاء بدون باراميتر (للتوافق) أو مع token/email
  const login = (newToken, userEmail) => {
    // إذا اتسلم token في النداء - خزّنه - وإلا نحاول قراءة الموجود في localStorage
    const tokenToUse = newToken || localStorage.getItem('token');
    if (!tokenToUse || tokenToUse === 'undefined') {
      console.warn('AuthProvider.login called without valid token. Falling back to localStorage.');
    } else {
      localStorage.setItem('token', tokenToUse);
      setToken(tokenToUse);
      setIsLoggedIn(true);
    }

    const emailToUse = userEmail || localStorage.getItem('email');
    if (emailToUse) {
      localStorage.setItem('email', emailToUse);
      setEmail(emailToUse);
      setIsAdmin(checkIfAdmin(emailToUse));
    } else {
      setEmail(null);
      setIsAdmin(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('isLoggedIn');
    setToken(null);
    setEmail(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      token,
      email,
      isAdmin,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
