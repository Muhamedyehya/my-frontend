// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaWhatsapp, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';


const API_BASE = 'http://localhost:5000';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  
  const [formData, setFormData] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.phone || !formData.whatsapp || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'برجاء ملء جميع الحقول' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'كلمة المرور غير متطابقة' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
      return;
    }

    // Basic phone validation
    if (!/^\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      setMessage({ type: 'error', text: 'رقم الهاتف غير صحيح' });
      return;
    }

    if (!/^\d{10,15}$/.test(formData.whatsapp.replace(/\s/g, ''))) {
      setMessage({ type: 'error', text: 'رقم الواتساب غير صحيح' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل في التسجيل');
      }

      // Save token
      login(data.token);

      setMessage({ type: 'success', text: 'تم التسجيل بنجاح! جاري التحويل...' });

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/AddPropertyPage');
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'حدث خطأ أثناء التسجيل' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)", 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "20px",
      direction: "rtl",
      fontFamily: "'Tajawal', sans-serif"
    }}>
      
      {/* Animated Background Elements */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 6s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '15%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite reverse' }} />

      <div style={{ ...glassCardStyle, maxWidth: 480, width: '100%', padding: 40, position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            margin: '0 auto 20px', 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            color: 'white',
            boxShadow: '0 10px 30px rgba(59,130,246,0.3)'
          }}>
            <FaUserPlus />
          </div>
          <h1 style={{ margin: 0, color: colors.accent, fontSize: 32, fontWeight: 700 }}>
            إنشاء حساب جديد
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: 16 }}>
            سجل الآن للوصول إلى لوحة التحكم
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div style={{ 
            padding: 14, 
            borderRadius: 12, 
            marginBottom: 24,
            border: `2px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
            background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: message.type === 'success' ? '#10b981' : '#ef4444',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Phone Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: colors.accent, fontWeight: 600, fontSize: 16 }}>
              <FaPhone style={{ marginLeft: 8, fontSize: 18 }} /> رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="05xxxxxxxx"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                border: '2px solid rgba(255,255,255,0.15)',
                color: colors.text,
                fontSize: 16,
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.secondary}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          {/* WhatsApp Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: colors.accent, fontWeight: 600, fontSize: 16 }}>
              <FaWhatsapp style={{ marginLeft: 8, fontSize: 18 }} /> رقم الواتساب
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="05xxxxxxxx"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                border: '2px solid rgba(255,255,255,0.15)',
                color: colors.text,
                fontSize: 16,
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.secondary}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          {/* Email Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: colors.accent, fontWeight: 600, fontSize: 16 }}>
              <FaEnvelope style={{ marginLeft: 8, fontSize: 18 }} /> البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@domain.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                border: '2px solid rgba(255,255,255,0.15)',
                color: colors.text,
                fontSize: 16,
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.secondary}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          {/* Password Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: colors.accent, fontWeight: 600, fontSize: 16 }}>
              <FaLock style={{ marginLeft: 8, fontSize: 18 }} /> كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 50px 14px 16px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  color: colors.text,
                  fontSize: 16,
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.secondary}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: colors.accent,
                  cursor: 'pointer',
                  fontSize: 18
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: colors.accent, fontWeight: 600, fontSize: 16 }}>
              <FaLock style={{ marginLeft: 8, fontSize: 18 }} /> تأكيد كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 50px 14px 16px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  color: colors.text,
                  fontSize: 16,
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.secondary}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: colors.accent,
                  cursor: 'pointer',
                  fontSize: 18
                }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              marginTop: 8,
              background: loading ? '#64748b' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 8px 20px rgba(59,130,246,0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 30px rgba(59,130,246,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 20px rgba(59,130,246,0.3)';
              }
            }}
          >
            {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
          </button>

        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            لديك حساب بالفعل؟{' '}
            <a 
              href="/loginPage" 
              style={{ 
                color: colors.accent, 
                textDecoration: 'none', 
                fontWeight: 700,
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = colors.secondary}
              onMouseLeave={(e) => e.target.style.color = colors.accent}
            >
              تسجيل الدخول
            </a>
          </p>
        </div>

      </div>

      {/* Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;