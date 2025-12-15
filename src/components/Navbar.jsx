// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaTh, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const colors = {
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#60a5fa",
    dark: "#0f172a",
    text: "#e2e8f0"
  };

  const glassStyle = {
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)"
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{ 
        ...glassStyle,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '16px 0',
        fontFamily: "'Tajawal', sans-serif"
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          direction: 'rtl'
        }}>
          
          {/* Logo */}
          <div 
            onClick={() => handleNavigation('/')}
            style={{ 
              fontSize: 24, 
              fontWeight: 700, 
              color: colors.accent,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FaHome /> عقارات جدة السعودية
          </div>

          {/* Desktop Menu */}
          <div style={{ 
            display: 'flex', 
            gap: 12,
            alignItems: 'center'
          }}>
            <div style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: 12 }}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleNavigation('/AddPropertyPage')}
                    style={{
                      padding: '10px 20px',
                      background: isActive('/AddPropertyPage') ? 'linear-gradient(135deg, #1e40af, #3b82f6)' : 'rgba(255,255,255,0.05)',
                      color: colors.text,
                      border: isActive('/AddPropertyPage') ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontSize: 16,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive('/AddPropertyPage')) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive('/AddPropertyPage')) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      }
                    }}
                  >
                    <FaTh /> لوحة التحكم
                  </button>

                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontSize: 16,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(220,38,38,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaSignOutAlt /> تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/loginPage')}
                    style={{
                      padding: '10px 20px',
                      background: isActive('/loginPage') ? 'linear-gradient(135deg, #1e40af, #3b82f6)' : 'rgba(255,255,255,0.05)',
                      color: colors.text,
                      border: isActive('/loginPage') ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontSize: 16,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive('/loginPage')) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive('/loginPage')) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      }
                    }}
                  >
                    <FaSignInAlt /> تسجيل الدخول
                  </button>

                  <button
                    onClick={() => handleNavigation('/RegisterPage')}
                    style={{
                      padding: '10px 20px',
                      background: isActive('/RegisterPage') ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontSize: 16,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(59,130,246,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaUserPlus /> إنشاء حساب
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: window.innerWidth <= 768 ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                color: colors.text,
                cursor: 'pointer',
                fontSize: 20
              }}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div style={{
            display: window.innerWidth <= 768 ? 'flex' : 'none',
            flexDirection: 'column',
            gap: 12,
            padding: '20px',
            marginTop: 16,
            background: 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            animation: 'slideDown 0.3s ease'
          }}>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => handleNavigation('/AddPropertyPage')}
                  style={{
                    padding: '12px 20px',
                    background: isActive('/AddPropertyPage') ? 'linear-gradient(135deg, #1e40af, #3b82f6)' : 'rgba(255,255,255,0.05)',
                    color: colors.text,
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <FaTh /> لوحة التحكم
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <FaSignOutAlt /> تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/loginPage')}
                  style={{
                    padding: '12px 20px',
                    background: isActive('/loginPage') ? 'linear-gradient(135deg, #1e40af, #3b82f6)' : 'rgba(255,255,255,0.05)',
                    color: colors.text,
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <FaSignInAlt /> تسجيل الدخول
                </button>

                <button
                  onClick={() => handleNavigation('/RegisterPage')}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <FaUserPlus /> إنشاء حساب
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;