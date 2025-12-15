import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AddPropertyPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    type: 'sale',
    category: 'villa',
    price: '',
    priceFrom: '',
    priceTo: '',
    location: '',
    area: '',
    rooms: '',
    bathrooms: '',
    description: '',
    phone: '',
    whatsapp: '',
    images: []
  });

  const [imagePreview, setImagePreview] = useState([]);
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
        setImagePreview(prev => [...prev, reader.result]);
      };
    });
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = { ...formData };

      if (formData.type === 'wanted') {
        payload.area = '';
        payload.rooms = '';
        payload.bathrooms = '';
        payload.description = '';
        payload.images = [];
      } else {
        delete payload.priceFrom;
        delete payload.priceTo;
      }

      if (!payload.phone || !payload.whatsapp) {
        setMessage({ type: 'error', text: 'رجاءً أدخل رقم الهاتف والواتساب' });
        setLoading(false);
        return;
      }

      console.log("=== FRONTEND DEBUG ===");
      console.log("Sending payload:", payload);

      const convertToBase64 = file => new Promise((resolve, reject) => {
        if (!(file instanceof File)) return resolve(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      if (formData.type !== 'wanted') {
        payload.images = await Promise.all(
          formData.images.map(file => convertToBase64(file))
        );
      }

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/ads", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'تم إضافة العقار بنجاح!' });
        setFormData({
          title: '', type: 'sale', category: 'villa', price: '', priceFrom: '', priceTo: '',
          location: '', area: '', rooms: '', bathrooms: '', description: '',
          phone: '', whatsapp: '', images: []
        });
        setImagePreview([]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إضافة العقار');
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء إضافة العقار. حاول مرة أخرى.' });
    } finally {
      setLoading(false);
    }
  };

  const isWanted = formData.type === 'wanted';

  return (
    <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)", minHeight: "100vh", width: "100%", padding: "30px 20px", direction: "rtl", color: colors.text, fontFamily: "'Tajawal', sans-serif", position: "relative", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ ...glassCardStyle, textAlign: "center", marginBottom: "40px", borderTop: `6px solid ${colors.secondary}`, background: "rgba(255,255,255,0.08)", padding: "32px" }}>
        <h1 style={{ fontSize: "clamp(2.5rem,7vw,4rem)", fontWeight: "900", color: colors.accent, margin: "0 0 16px 0" }}>لوحة التحكم</h1>
        <p style={{ fontSize: "clamp(1.1rem,3vw,1.4rem)", color: "#cbd5e1", margin: 0 }}>إضافة عقار جديد إلى القائمة</p>
      </div>

      <Link
        to="/"
        className="back-btn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 32px",
          background: "rgba(96, 165, 250, 0.15)",
          color: colors.accent,
          fontSize: "1.1rem",
          fontWeight: "700",
          borderRadius: "16px",
          border: "2px solid rgba(96, 165, 250, 0.4)",
          textDecoration: "none",
          backdropFilter: "blur(12px)",
          marginBottom: "30px",
          transition: "all 0.3s ease",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(59, 130, 246, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        العودة للرئيسية
      </Link>

      {/* Success/Error Message */}
      {message.text && (
        <div style={{ ...glassCardStyle, padding: "20px 24px", marginBottom: "30px", background: message.type === 'success' ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", border: `2px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`, display: "flex", alignItems: "center", gap: "12px" }}>
          {message.type === 'success' ? <FaCheck style={{ fontSize: "1.5rem", color: "#10b981" }} /> : <FaTimes style={{ fontSize: "1.5rem", color: "#ef4444" }} />}
          <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>{message.text}</span>
        </div>
      )}

      {/* Main Form */}
      <div style={{ ...glassCardStyle, padding: "40px", background: "rgba(255,255,255,0.08)" }}>
        {/* Title */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>عنوان العقار *</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid rgba(96,165,250,0.4)", background: "rgba(255,255,255,0.1)", color: "white" }} placeholder="مثال: فيلا فاخرة بحديقة واسعة" />
        </div>

        {/* Type & Category */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "24px", marginBottom: "28px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>نوع العرض *</label>
            <select name="type" value={formData.type} onChange={handleInputChange} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid rgba(96,165,250,0.4)", background: "rgba(255,255,255,0.1)", color: "white" }}>
              <option value="sale">للبيع</option>
              <option value="rent">للإيجار</option>
              <option value="wanted">مطلوب</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>التصنيف *</label>
            <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid rgba(96,165,250,0.4)", background: "rgba(255,255,255,0.1)", color: "white" }}>
              <option value="villa">فيلا</option>
              <option value="apartment">شقة</option>
              <option value="commercial">تجاري</option>
              <option value="building">عمارة</option>
              <option value="land">أرض</option>
              <option value="floor">دور</option>
              <option value="resthouse">استراحة</option>
            </select>
          </div>
        </div>

        {/* Price / Price Range */}
        <div style={{ display: "grid", gridTemplateColumns: isWanted ? "1fr 1fr 1fr" : "1fr 1fr", gap: "24px", marginBottom: "28px" }}>
          {isWanted ? (
            <>
              <div>
                <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>السعر من *</label>
                <input
                  type="text"
                  name="priceFrom"
                  value={formData.priceFrom}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid rgba(96,165,250,0.4)", background: "rgba(255,255,255,0.1)", color: "white" }}
                  placeholder="مثال: 500,000"
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>السعر إلى *</label>
                <input
                  type="text"
                  name="priceTo"
                  value={formData.priceTo}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid rgba(96,165,250,0.4)", background: "rgba(255,255,255,0.1)", color: "white" }}
                  placeholder="مثال: 1,000,000"
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>الموقع *</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid rgba(96,165,250,0.4)", background: "rgba(255,255,255,0.1)", color: "white" }} placeholder="مثال: مخطط القرينية" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>السعر *</label>
                <input type="text" name="price" value={formData.price} onChange={handleInputChange} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid rgba(96,165,250,0.4)", background: "rgba(255,255,255,0.1)", color: "white" }} placeholder="مثال: 2,500,000 أو 3,500 (للإيجار الشهري)" />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>الموقع *</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid rgba(96,165,250,0.4)", background: "rgba(255,255,255,0.1)", color: "white" }} placeholder="مثال: مخطط القرينية - منح الخمرة" />
              </div>
            </>
          )}
        </div>

        {/* Phone & WhatsApp Numbers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "24px", marginBottom: "28px", padding: "20px", borderRadius: "16px", background: "rgba(96,165,250,0.05)", border: "2px solid rgba(96,165,250,0.2)" }}>
          <div style={{ gridColumn: "1/-1", marginBottom: "8px" }}>
            <h3 style={{ margin: 0, color: colors.accent, fontSize: "1.3rem", fontWeight: "700" }}>📞 معلومات الاتصال</h3>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>رقم الهاتف *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid rgba(96,165,250,0.4)", background: "rgba(255,255,255,0.1)", color: "white" }}
              placeholder="مثال: +966539416401"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>رقم الواتساب *</label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid rgba(96,165,250,0.4)", background: "rgba(255,255,255,0.1)", color: "white" }}
              placeholder="مثال: +966539416401"
            />
          </div>
        </div>

        {/* Area, Rooms, Bathrooms */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "24px", marginBottom: "28px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>المساحة (م²) *</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              disabled={isWanted}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "2px solid rgba(96,165,250,0.4)",
                background: isWanted ? "rgba(100,116,139,0.2)" : "rgba(255,255,255,0.1)",
                color: isWanted ? "#94a3b8" : "white",
                cursor: isWanted ? "not-allowed" : "text"
              }}
              placeholder={isWanted ? "غير متاح للمطلوب" : "مثال: 450"}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>عدد الغرف</label>
            <input
              type="number"
              name="rooms"
              value={formData.rooms}
              onChange={handleInputChange}
              disabled={isWanted}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "2px solid rgba(96,165,250,0.4)",
                background: isWanted ? "rgba(100,116,139,0.2)" : "rgba(255,255,255,0.1)",
                color: isWanted ? "#94a3b8" : "white",
                cursor: isWanted ? "not-allowed" : "text"
              }}
              placeholder={isWanted ? "غير متاح للمطلوب" : "مثال: 5"}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>عدد الحمامات</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              disabled={isWanted}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "2px solid rgba(96,165,250,0.4)",
                background: isWanted ? "rgba(100,116,139,0.2)" : "rgba(255,255,255,0.1)",
                color: isWanted ? "#94a3b8" : "white",
                cursor: isWanted ? "not-allowed" : "text"
              }}
              placeholder={isWanted ? "غير متاح للمطلوب" : "مثال: 4"}
            />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>الوصف</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="6"
            disabled={isWanted}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "2px solid rgba(96,165,250,0.4)",
              background: isWanted ? "rgba(100,116,139,0.2)" : "rgba(255,255,255,0.1)",
              color: isWanted ? "#94a3b8" : "white",
              cursor: isWanted ? "not-allowed" : "text",
              resize: "vertical"
            }}
            placeholder={isWanted ? "غير متاح للمطلوب" : "اكتب وصف تفصيلي للعقار..."}
          ></textarea>
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", marginBottom: "12px", fontSize: "1.2rem", fontWeight: "700", color: colors.accent }}>صور العقار</label>

          {isWanted ? (
            <div style={{
              padding: "40px 20px",
              borderRadius: "14px",
              border: "2px dashed rgba(100,116,139,0.4)",
              background: "rgba(100,116,139,0.1)",
              textAlign: "center",
              color: "#94a3b8"
            }}>
              <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                📸 رفع الصور غير متاح للإعلانات من نوع "مطلوب"
              </p>
            </div>
          ) : (
            <>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "block", marginBottom: "16px" }}
              />
              {imagePreview.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: "16px" }}>
                  {imagePreview.map((img, index) => (
                    <div key={index} style={{ position: "relative", paddingBottom: "100%", borderRadius: "12px", overflow: "hidden", background: `url(${img}) center/cover no-repeat` }}>
                      <button type="button" onClick={() => removeImage(index)} style={{ position: "absolute", top: "8px", right: "8px", width: "32px", height: "32px", background: "rgba(239,68,68,0.9)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "20px",
            background: loading ? "rgba(100,116,139,0.5)" : "linear-gradient(135deg,#1e40af,#3b82f6)",
            color: "white",
            border: "none",
            borderRadius: "16px",
            fontSize: "1.3rem",
            fontWeight: "800",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "16px",
            transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 6px 20px rgba(59,130,246,0.4)"
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(59,130,246,0.6)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.4)";
            }
          }}
        >
          {loading ? "جاري الإضافة..." : "إضافة العقار"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 24px",
            background: "rgba(239,68,68,0.2)",
            color: "#fca5a5",
            border: "2px solid #ef4444",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(239,68,68,0.3)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(239,68,68,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(239,68,68,0.3)";
          }}
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default AddPropertyPage;