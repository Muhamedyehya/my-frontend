// src/components/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cart from '../components/Cart.jsx';
import { FaFilter, FaHome, FaBuilding, FaStore, FaArrowRight, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

const CartPage = () => {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('all');
  const [saleFilter, setSaleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/ads', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!response.ok) throw new Error('فشل جلب البيانات');
      const data = await response.json();
      console.log("ADS RESPONSE:", data);
      setProperties(data.ads);
    } catch (err) {
      setError('فشل تحميل العقارات، تأكد من وجود الملف');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchProperties();
}, []);

  const colors = {
    accent: "#60a5fa",
    secondary: "#3b82f6",
    green: "#10b981"
  };


  const filteredProperties = properties.filter(p => {
  const categoryMatch = filter === 'all' || p.category === filter;
  const saleMatch = saleFilter === 'all' || (p.type && p.type.toLowerCase() === saleFilter);
  return categoryMatch && saleMatch;
});


  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      minHeight: "100vh",
      padding: "30px 20px",
      direction: "rtl",
      color: "#e2e8f0",
      fontFamily: "'Tajawal', sans-serif",
      position: "relative",
      borderRadius:"24px",
      overflow: "hidden"
    }}>

      <style >{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

        body { margin: 0; background: #0f172a; }

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
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(59, 130, 246, 0.3); }
        
        .property-card { 
          transition: all 0.4s ease;
          cursor: pointer;
        }
        .property-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.4);
          border: 1px solid rgba(96, 165, 250, 0.3);
        }

        .filter-btn {
          transition: all 0.3s ease;
        }
        .filter-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .contact-btn {
          transition: all 0.3s ease;
        }
        .contact-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(96, 165, 250, 0.6);
        }

        .back-btn:hover {
          transform: translateX(5px);
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
        }
      `}</style>

      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        

        {/* العنوان */}
        <div style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.4)",
          padding: "32px",
          textAlign: "center",
          marginBottom: "40px",
          borderTop: `6px solid ${colors.secondary}`
        }}>
          <h1 className="glow" style={{
            fontSize: "clamp(2.5rem, 7vw, 4rem)",
            fontWeight: "900",
            color: colors.accent,
            margin: "0 0 16px 0",
            letterSpacing: "-1px"
          }}>
            العقارات المتاحة
          </h1>
          <p style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", color: "#cbd5e1", margin: 0 }}>
            اختر من بين مجموعة واسعة من العقارات المميزة
          </p>
        </div>

{/* زر العودة */}
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
        >
          العودة للرئيسية
        </Link>
        
        {/* قسم الفلاتر */}
        <div style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          padding: "28px",
          marginBottom: "40px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <FaFilter style={{ fontSize: "1.4rem", color: colors.accent }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: colors.accent, margin: 0 }}>
              تصفية النتائج
            </h3>
          </div>

          {/* فلتر النوع (زرقاء) */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", marginBottom: "24px" }}>
  {[
  { id: 'all', label: 'الكل', icon: FaHome },
  { id: 'villa', label: 'فلل', icon: FaHome },
  { id: 'apartment', label: 'شقق', icon: FaBuilding },
  { id: 'building', label: 'عمارات', icon: FaBuilding },
  { id: 'commercial', label: 'محلات', icon: FaStore },
  { id: 'land', label: 'أراضي', icon: FaHome },
  { id: 'floor', label: 'أدوار', icon: FaBuilding },
  { id: 'resthouse', label: 'استراحات', icon: FaHome }
].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="type-filter-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 32px",
                  background: filter === f.id
                    ? "linear-gradient(135deg, #1e40af, #3b82f6)"
                    : "rgba(255, 255, 255, 0.08)",
                  color: filter === f.id ? "white" : "#e2e8f0",
                  border: filter === f.id
                    ? "2px solid #60a5fa"
                    : "2px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "16px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                <f.icon style={{ fontSize: "1.2rem" }} />
    {f.label}
  </button>
))}
          </div>

          <div style={{ width: "100%", height: "2px", background: "rgba(255, 255, 255, 0.1)", margin: "20px 0" }}></div>

          {/* فلتر البيع/الإيجار (خضراء) */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            {[
              { id: 'all', label: 'الكل' },
              { id: 'sale', label: 'للبيع' },
              { id: 'rent', label: 'للإيجار' },
              { id: 'wanted', label: 'مطلوب' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSaleFilter(f.id)}
                className="sale-filter-btn"
                style={{
                  padding: "14px 36px",
                  background: saleFilter === f.id
                    ? "linear-gradient(135deg, #059669, #10b981)"
                    : "rgba(255, 255, 255, 0.08)",
                  color: saleFilter === f.id ? "white" : "#e2e8f0",
                  border: saleFilter === f.id
                    ? "2px solid #10b981"
                    : "2px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "16px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* العقارات */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#94a3b8", fontSize: "1.6rem" }}>
            جاري تحميل العقارات...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#ef4444", fontSize: "1.6rem" }}>
            {error}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#94a3b8", fontSize: "1.6rem" }}>
            لا توجد عقارات متاحة حاليًا بهذه الفلاتر
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "32px",
            justifyContent: "center",
            padding: "0 10px"
          }}>
            {filteredProperties.map(property => (
              <div key={property._id} style={{ flex: "1 1 340px", maxWidth: "420px", minWidth: "320px" }}>
                <Cart property={property} />
              </div>
            ))}
          </div>
        )}

        {/* Footer Contact */}
        <div style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          padding: "40px",
          textAlign: "center",
          marginTop: "60px",
          borderTop: `4px solid ${colors.secondary}`
        }}>
          <h3 className="glow" style={{ fontSize: "clamp(1.8rem, 5vw, 2.4rem)", fontWeight: "900", color: colors.accent, marginBottom: "20px" }}>
            لم تجد ما تبحث عنه؟
          </h3>
          <p style={{ fontSize: "1.2rem", color: "#cbd5e1", marginBottom: "30px" }}>
            تواصل معنا وسنساعدك في إيجاد العقار المثالي
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:0539416401" style={{
              display: "inline-flex", alignItems: "center", gap: "12px", padding: "18px 36px",
              background: "linear-gradient(135deg, #1e40af, #3b82f6)", color: "white", borderRadius: "16px",
              textDecoration: "none", fontWeight: "800", fontSize: "1.2rem", transition: "all 0.3s ease"
            }}>
              اتصل الآن
            </a>
            <a href="https://wa.me/966539416401" style={{
              display: "inline-flex", alignItems: "center", gap: "12px", padding: "18px 36px",
              background: "linear-gradient(135deg, #059669, #10b981)", color: "white", borderRadius: "16px",
              textDecoration: "none", fontWeight: "800", fontSize: "1.2rem", transition: "all 0.3s ease"
            }}>
              واتساب
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;