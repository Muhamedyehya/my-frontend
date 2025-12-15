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
 
  useEffect(() => { 
    // نشوف لو فيه token محفوظ
    const savedToken = localStorage.getItem('token');
    
    // 🧹 نمسح أي authToken قديم
    if (localStorage.getItem('authToken')) {
      localStorage.removeItem('authToken');
    }
    
    if (savedToken && savedToken !== 'undefined') { 
      setToken(savedToken); 
      setIsLoggedIn(true); 
    } else {
      // لو التوكن undefined أو مش موجود، نمسح كل حاجة
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      setToken(null);
      setIsLoggedIn(false);
    }
  }, []); 
 
  const login = (newToken) => {
    if (!newToken || newToken === 'undefined') {
      console.error('❌ Token is invalid:', newToken);
      return;
    }
    
    // 🧹 نمسح أي authToken قديم
    localStorage.removeItem('authToken');
    
    // نحفظ token فقط
    localStorage.setItem('token', newToken);
    localStorage.setItem('isLoggedIn', 'true');
    setToken(newToken); 
    setIsLoggedIn(true); 
  }; 
 
  const logout = () => { 
    // نمسح كل أنواع التوكنات
    localStorage.removeItem('token');
    localStorage.removeItem('authToken'); // 🧹 نتأكد إنه متمسوح
        localStorage.removeItem('email');
    localStorage.removeItem('isLoggedIn');
    setToken(null); 
    setIsLoggedIn(false); 
  }; 
 
  return ( 
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}> 
      {children} 
    </AuthContext.Provider> 
  ); 
};