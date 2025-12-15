import React from 'react';
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaHome, FaHandshake, FaBullhorn, FaBriefcase, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = () => {
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
    padding: "32px",
    transition: "all 0.4s ease"
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      minHeight: "100vh",
      padding: "30px 20px",
      direction: "rtl",
      borderRadius:"25px",
      color: colors.text,
      fontFamily: "'Tajawal', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');

        body { margin: 0; background: #0f172a; }

          .action-button { transition: all 0.4s ease; }
          .action-button:hover { transform: translateY(-3px); box-shadow: 0 10px 40px rgba(59, 130, 246, 0.5); }

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
        
        .service-card { transition: all 0.4s ease; }
        .service-card:hover {
           transform: translateY(-14px) scale(1.03);
           background: rgba(255, 255, 255, 0.1);
           border: 1px solid rgba(96, 165, 250, 0.3);
           box-shadow: 0 20px 50px rgba(59, 130, 246, 0.35);}

        .cta-button:hover {
           transform: translateY(-6px) scale(1.05);
           background: rgba(96, 165, 250, 0.3);
           border-color: #60a5fa;
           box-shadow: 0 20px 60px rgba(59, 130, 246, 0.5);
           text-shadow: 0 0 20px rgba(96, 165, 250, 0.8);}

      `}</style>

      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ 
          ...glassCardStyle, 
          textAlign: "center", 
          marginBottom: "40px",
          borderTop: `6px solid ${colors.secondary}`,
          background: "rgba(255, 255, 255, 0.08)"
        }}>
          <h1 className="glow" style={{ 
            fontSize: "clamp(2.8rem, 8vw, 4.5rem)", 
            fontWeight: "900", 
            color: colors.accent, 
            margin: "0 0 16px 0",
            letterSpacing: "-1px"
          }}>
            عقار جدة
          </h1>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ background: "linear-gradient(135deg, #3b82f6, #60a5fa)", color: "white", padding: "10px 24px", borderRadius: "50px", fontWeight: "bold", fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", boxShadow: "0 0 20px rgba(59,130,246,0.5)" }}>
              مكتب معتمد
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 6vw, 2.8rem)", margin: 0, fontWeight: "800", color: "#e2e8f0" }}>
             عقارات جدة السعودية
            </h2>
          </div>
          <div style={{ marginTop: "20px", fontSize: "1.1rem", color: "#cbd5e1", display: "inline-flex", alignItems: "center", gap: "12px", padding: "12px 28px", background: "rgba(255,255,255,0.06)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <FaBriefcase style={{ fontSize: "1.3rem" }} /> رقم ترخيص : 1100062268
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "28px",
          justifyContent: "center",
          marginBottom: "40px"
        }}>

          {/* Contact Card */}
          <div className="card-hover" style={{
            ...glassCardStyle,
            flex: "1 1 380px",
            maxWidth: "600px",
            minWidth: "340px"
          }}>
            <h3 style={{ fontSize: "1.7rem", fontWeight: "800", marginBottom: "32px", color: colors.accent, display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ width: "6px", height: "36px", background: "linear-gradient(to bottom, #3b82f6, #60a5fa)", borderRadius: "6px" }}></span>
              بيانات التواصل
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                { icon: FaPhoneAlt, text: "0539416401", label: "الجوال", color: "#60a5fa" },
                { icon: FaWhatsapp, text: "966539416401", label: "واتساب", color: "#25D366" },
                { icon: FaEnvelope, text: "tajir2030@gmail.com", label: "البريد", color: "#60a5fa" },
                { icon: FaMapMarkerAlt, text: "مخطط القرينية - منح الخمرة", label: "الموقع", color: "#60a5fa" }
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "18px 22px",
                  background: "rgba(255, 255, 255, 0.07)",
                  borderRadius: "18px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  flexDirection: "row-reverse"
                }}>
                  <item.icon style={{ fontSize: "2.8rem", color: item.color, filter: "drop-shadow(0 0 12px currentColor)" }} />
                  <div style={{ textAlign: "right", flex: 1 }}>
                    <div style={{ fontSize: "1rem", color: "#94a3b8", fontWeight: "500", marginBottom: "6px" }}>{item.label}</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ffffff" }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card-hover" style={{
            ...glassCardStyle,
            flex: "1 1 380px",
            maxWidth: "500px",
            minWidth: "340px"
          }}>
            <h3 style={{ fontSize: "1.7rem", fontWeight: "800", marginBottom: "32px", color: colors.accent, display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ width: "6px", height: "36px", background: "linear-gradient(to bottom, #3b82f6, #60a5fa)", borderRadius: "6px" }}></span>
              تواصل سريع
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <a href="tel:0539416401" className="action-button card-hover" style={{ textDecoration: "none", background: "linear-gradient(135deg, #1e40af, #3b82f6)", color: "white", padding: "22px", borderRadius: "18px", fontWeight: "bold", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
                <FaPhoneAlt /> إتصال هاتفي
              </a>
              <a href="https://wa.me/966539416401" className="action-button card-hover" style={{ textDecoration: "none", background: "linear-gradient(135deg, #059669, #10b981)", color: "white", padding: "22px", borderRadius: "18px", fontWeight: "bold", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
                <FaWhatsapp /> مراسلة واتساب
              </a>
              <a href="mailto:tajir2030@gmail.com" className="action-button card-hover" style={{ textDecoration: "none", border: "2px solid #60a5fa", background: "rgba(96, 165, 250, 0.15)", color: colors.accent, padding: "20px", borderRadius: "18px", fontWeight: "bold", fontSize: "1.2rem", backdropFilter: "blur(10px)" }}>
                إرسال إيميل
              </a>
            </div>
          </div>
        </div>

          {/* Services Section */}
<div style={{ ...glassCardStyle, margin: "40px auto", maxWidth: "1400px" }}>
  <h3 className="glow" style={{ 
    textAlign: "center", 
    fontSize: "clamp(2rem, 6vw, 2.8rem)", 
    fontWeight: "900", 
    color: colors.accent, 
    marginBottom: "50px" 
  }}>
    الخدمات العقارية المتكاملة
  </h3>

  <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "32px",
    justifyContent: "center"
  }}>
    {[
      { title: "بيع وشراء", icon: FaHome, desc: "إيجاد أفضل الفرص السكنية والاستثمارية بجدة" },
      { title: "تأجير", icon: FaHandshake, desc: "إدارة وتأجير العقارات السكنية والتجارية" },
      { title: "تسويق", icon: FaBullhorn, desc: "خطط تسويقية احترافية عبر جميع المنصات" },
      { title: "استشارات", icon: FaBriefcase, desc: "تحليل دقيق للسوق العقاري في منطقة الخمرة" }
    ].map((s, i) => (
      <div 
        key={i}
        className="service-card"
        style={{
          flex: "1 1 280px",
          maxWidth: "380px",
          background: "rgba(255, 255, 255, 0.06)",
          padding: "34px 26px",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "default"
        }}
      >
        <s.icon style={{
  display: "block",
  margin: "0 auto 18px",
  fontSize: "3rem",
  color: colors.secondary,
  filter: "drop-shadow(0 0 12px rgba(59,130,246,0.6))"
}} />

<h4 style={{
  fontSize: "1.55rem",
  fontWeight: "800",
  color: colors.accent,
  margin: "10px 0 14px",
  textAlign: "center"
}}>
  {s.title}
</h4>

              <p style={{ 
                fontSize: "1.08rem", 
                color: "#cbd5e1", 
                lineHeight: "1.9", 
                fontWeight: "400" 
             }}>
               {s.desc}
             </p>
            </div>
          ))}
       </div>
    </div>

        {/* CTA Button */}
<div style={{ textAlign: "center", padding: "60px 20px" }}>
  <Link
    to="/CartPage"
    className="cta-button"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "18px",
      padding: "22px 48px",
      background: "rgba(96, 165, 250, 0.18)",
      color: "#60a5fa",
      fontSize: "clamp(1.35rem, 4.5vw, 1.8rem)",
      fontWeight: "800",
      borderRadius: "28px",
      border: "3px solid rgba(96, 165, 250, 0.45)",
      textDecoration: "none",
      backdropFilter: "blur(14px)",
      boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer"}}
>
  تصفح قائمة العقارات المتاحة 
  <FaArrowLeft style={{ fontSize: "1.6rem" }} />
</Link>
</div>
</div>
</div>
  );}
export default Hero;