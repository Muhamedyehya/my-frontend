// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaUser, FaHome } from 'react-icons/fa';

const LoginPage = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const colors = {
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#60a5fa",
    dark: "#0f172a",
    text: "#e2e8f0"
  };

  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "0 8px 40px rgba(0, 0, 0, 0.4)",
    transition: "all 0.4s ease"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    console.log("Attempting login with:", formData.email);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email.trim(), 
          password: formData.password 
        })
      });

      const data = await res.json();
      console.log("Server response:", data);
      if (!res.ok) {
        setMessage({ 
          type: 'error', 
          text: data.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
        });
        setLoading(false);
        return;
      }

      // حفظ التوكن في localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("authToken", data.token); // backup
        console.log("Token saved:", data);
        localStorage.setItem("email", formData.email);
        console.log(formData.email,"this is the email ");
        
        // استدعاء login من AuthContext
        login();

        setMessage({ type: 'success', text: 'تم تسجيل الدخول بنجاح!' });

        // الانتقال للوحة التحكم
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        throw new Error("No token received from server");
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'حدث خطأ في الاتصال بالسيرفر' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && formData.email && formData.password) {
      handleSubmit();
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    setMessage({ type: 'success', text: 'تم تسجيل الخروج بنجاح' });
    setTimeout(() => navigate("/"), 1000);
  };

  const isDisabled = loading || !formData.email.trim() || !formData.password;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      minHeight: "100vh",
      padding: "30px 20px",
      direction: "rtl",
      color: colors.text,
      fontFamily: "'Tajawal', sans-serif",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.25;
          animation: float 25s infinite ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -50px) rotate(10deg); }
        }
        .floating-shape:nth-child(1) { width: 500px; height: 500px; background: linear-gradient(135deg, #1e40af, #3b82f6); top: -150px; right: -150px; }
        .floating-shape:nth-child(2) { width: 450px; height: 450px; background: linear-gradient(135deg, #3b82f6, #60a5fa); bottom: -120px; left: -120px; animation-delay: 7s; }
        .floating-shape:nth-child(3) { width: 400px; height: 400px; background: linear-gradient(135deg, #60a5fa, #93c5fd); top: 40%; left: 50%; animation-delay: 14s; }

        .glow { text-shadow: 0 0 25px rgba(96, 165, 250, 0.7); }

        .input-field {
          width: 100%;
          padding: 16px 50px 16px 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          color: white;
          font-size: 1.1rem;
          font-family: 'Tajawal', sans-serif;
          transition: all 0.3s ease;
          outline: none;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: #60a5fa;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>

      <div style={{ maxWidth: "500px", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{
          ...glassCardStyle,
          padding: "50px 40px",
          background: "rgba(255, 255, 255, 0.08)",
          borderTop: `6px solid ${colors.secondary}`
        }}>

          <div style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #1e40af, #3b82f6)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 30px",
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
          }}>
            <FaUser style={{ fontSize: "2.5rem", color: "white" }} />
          </div>

          <h1 className="glow" style={{ 
            fontSize: "clamp(2rem, 6vw, 2.8rem)", 
            fontWeight: "900", 
            color: colors.accent, 
            margin: "0 0 12px 0",
            letterSpacing: "-1px",
            textAlign: "center"
          }}>
            تسجيل الدخول
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#94a3b8", margin: "0 0 40px 0", textAlign: "center" }}>
            مرحباً بك في لوحة التحكم
          </p>

          {message.text && (
            <div style={{
              padding: "16px 20px",
              marginBottom: "24px",
              background: message.type === 'success' ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              border: `2px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "1rem",
              fontWeight: "600"
            }}>
              {message.text}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "24px", position: "relative" }}>
            <label style={{ display: "block", marginBottom: "10px", fontSize: "1.1rem", fontWeight: "600", color: colors.text }}>
              البريد الإلكتروني
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="input-field"
                placeholder="admin@example.com"
                required
              />
              <FaEnvelope style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "1.3rem",
                color: colors.accent,
                pointerEvents: "none"
              }} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "32px", position: "relative" }}>
            <label style={{ display: "block", marginBottom: "10px", fontSize: "1.1rem", fontWeight: "600", color: colors.text }}>
              كلمة المرور
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="input-field"
                placeholder="••••••••"
                required
              />
              <FaLock style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "1.3rem",
                color: colors.accent,
                pointerEvents: "none"
              }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "1.2rem"
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* زر تسجيل الدخول */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            style={{
              width: "100%",
              padding: "18px",
              background: isDisabled ? "rgba(100, 116, 139, 0.6)" : "linear-gradient(135deg, #1e40af, #3b82f6)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontSize: "1.2rem",
              fontWeight: "800",
              cursor: isDisabled ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              transition: "all 0.4s ease",
              boxShadow: isDisabled ? "none" : "0 6px 20px rgba(59, 130, 246, 0.4)",
              marginTop: "10px"
            }}
            onMouseEnter={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(59, 130, 246, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)";
              }
            }}
          >
            {loading ? (
              <div style={{
                width: "20px",
                height: "20px",
                border: "3px solid rgba(255,255,255,0.3)",
                borderTop: "3px solid white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></div>
            ) : (
              <>
                <FaSignInAlt style={{ fontSize: "1.4rem" }} />
                تسجيل الدخول
              </>
            )}
          </button>

          {/* الأزرار السفلية */}
          <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
            {/* العودة للرئيسية */}
            <a
              href="/"
              style={{
                flex: 1,
                minWidth: "200px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "14px 24px",
                background: "rgba(96, 165, 250, 0.12)",
                color: colors.accent,
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: "14px",
                border: "2px solid rgba(96, 165, 250, 0.25)",
                textDecoration: "none",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(96, 165, 250, 0.2)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(96, 165, 250, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(96, 165, 250, 0.2)";
              }}
            >
              <FaHome /> الرئيسية
            </a>

            {/* تسجيل الخروج */}
            <button
              onClick={handleLogout}
              style={{
                flex: 1,
                minWidth: "200px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "14px 24px",
                background: "rgba(239,68,68,0.2)",
                color: "#fca5a5",
                border: "2px solid #ef4444",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(239, 68, 68, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
              }}
            >
              خروج
            </button>
          </div>

          <div style={{
            marginTop: "30px",
            padding: "20px",
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: "12px",
            textAlign: "center",
            fontSize: "0.95rem",
            color: "#94a3b8",
            border: "1px solid rgba(255, 255, 255, 0.08)"
          }}>
            <strong style={{ color: colors.accent }}>ملاحظة:</strong><br />
            <strong style={{ color: colors.accent }}>للمسؤولين فقط</strong>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;