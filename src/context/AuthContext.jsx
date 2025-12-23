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

/**
 * Helper: يحاول يفك الـ JWT token ويعيد الـ payload ككائن JS
 * إذا لم يكن token JWT أو حدث خطأ، يرجع null
 */
function decodeJwtPayload(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    console.warn('JWT decode failed:', e);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // عند البداية نحاول نقرأ التوكن من localStorage
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');

    if (savedToken && savedToken !== 'undefined') {
      setToken(savedToken);
      setIsLoggedIn(true);

      // حاول نفك الـ JWT ونعرف isAdmin من البايلود
      const payload = decodeJwtPayload(savedToken);
      if (payload) {
        // إذا الباك إند وضع claim اسمه isAdmin داخل التوكن نستخدمه
        if (payload.isAdmin) {
          setIsAdmin(true);
        } else {
          // كحل احتياطي: لو البايلود يحتوي إيميل ادمن معين
          if (payload.email && payload.email === 'admin@gmail.com') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
        if (payload.email) setEmail(payload.email);
      } else {
        // لو ما في توكن بصيغة JWT، نستخدم savedEmail كحل مؤقت
        if (savedEmail && savedEmail === 'admin@gmail.com') {
          setIsAdmin(true);
          setEmail(savedEmail);
        } else {
          setIsAdmin(false);
        }
      }
    } else {
      // نظف
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      setToken(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
      setEmail(null);
    }
  }, []);

  /**
   * login: نحط التوكن في localStorage ونحدّث الحالات
   * @param {string} newToken - توكن JWT من السيرفر
   */
  const login = (newToken) => {
    if (!newToken || newToken === 'undefined') {
      console.error('❌ Token is invalid:', newToken);
      return;
    }

    try {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setIsLoggedIn(true);

      const payload = decodeJwtPayload(newToken);
      if (payload) {
        setEmail(payload.email || null);
        setIsAdmin(Boolean(payload.isAdmin) || (payload.email === 'admin@gmail.com'));
        if (payload.email) localStorage.setItem('email', payload.email);
      } else {
        // fallback: لا يمكن الوثوق به لفترات طويلة
        const maybeEmail = localStorage.getItem('email');
        setIsAdmin(maybeEmail === 'admin@gmail.com');
      }
    } catch (e) {
      console.error('Login error:', e);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('isLoggedIn');
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, isAdmin, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
