// src/pages/LoginPage.jsx   <-- تأكد من المسار نفسه لديك (أنت ذكرت ملفات في pages وcomponents، ضع الملف في نفس مكان النسخة الأصلية)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaUser, FaHome } from 'react-icons/fa';
import { apiUrl } from '../api';

const LoginPage = () => {
  const { login, logout } = useAuth(); // نستخدم login من الـ context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const colors = { primary: "#1e40af", secondary: "#3b82f6", accent: "#60a5fa", dark: "#0f172a", text: "#e2e8f0" };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        setLoading(false);
        return;
      }

      if (data.token) {
        // مهم جداً: نخزن الايميل و التوكن في localStorage
        const userEmail = formData.email.trim();
        localStorage.setItem('email', userEmail);
        localStorage.setItem('token', data.token);
        localStorage.setItem('isLoggedIn', 'true');

        // نخبر الـ AuthContext (المصدر المركزي) بالتوكن والايميل
        login(data.token, userEmail);

        setMessage({ type: 'success', text: 'تم تسجيل الدخول بنجاح!' });
        // نقله للصفحة الرئيسية بعد ثواني بسيطة
        setTimeout(() => navigate('/'), 700);
      } else {
        throw new Error('لم يتم استقبال توكن من السيرفر');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage({ type: 'error', text: err.message || 'حدث خطأ أثناء الاتصال بالسيرفر' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && formData.email && formData.password) {
      handleSubmit();
    }
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
      <div style={{ maxWidth: "500px", width: "100%" }}>
        <div style={{
          background: "rgba(255,255,255,0.06)",
          padding: "40px",
          borderRadius: 16,
          borderTop: `6px solid ${colors.secondary}`
        }}>
          <h1 style={{ textAlign: "center", marginBottom: 10, color: colors.accent }}>تسجيل الدخول</h1>
          {message.text && (
            <div style={{ marginBottom: 16, padding: 12, background: message.type === 'success' ? '#0f5132' : '#3b0d0d', color: 'white', borderRadius: 8 }}>
              {message.text}
            </div>
          )}

          <label style={{ display: 'block', marginBottom: 6 }}>البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 12 }}
          />

          <label style={{ display: 'block', marginBottom: 6 }}>كلمة المرور</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 12 }}
            />
            <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', left: 10, top: 10, background: 'none', border: 'none', color: '#94a3b8' }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            style={{ width: '100%', padding: 14, borderRadius: 10, background: isDisabled ? '#64748b' : 'linear-gradient(135deg,#1e40af,#3b82f6)', color: 'white', border: 'none', fontWeight: '700' }}
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
