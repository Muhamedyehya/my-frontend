import React from 'react';
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaSearch, FaEye } from 'react-icons/fa';
import PropertyTypeBadge from "../components/PropertyTypeBadge";

const Cart = ({ property }) => {
  console.log("CART PROPERTY:", property);
  const colors = {
    accent: "#60a5fa",
    secondary: "#3b82f6"
  };

  // Check if it's a "wanted" type
  const isWanted = property.type === 'wanted';

  // Handle image - wanted ads might not have images
  const imageUrl = !isWanted && property.images && property.images.length > 0
    ? property.images[0]
    : isWanted 
    ? 'https://via.placeholder.com/800x600/dc2626/ffffff?text=مطلوب'
    : 'https://via.placeholder.com/800x600/1e293b/64748b?text=لا+توجد+صورة';

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        padding: "30px 20px",
        direction: "rtl",
        fontFamily: "'Tajawal', sans-serif",
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden"
      }}
    >

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');
        
        .btn-hover {
          transition: all 0.3s ease;
        }
        
        .btn-hover:hover {
          transform: translateY(-4px);
        }
        
        .btn-purple:hover {
          box-shadow: 0 8px 25px rgba(124,58,237,0.5);
        }
        
        .btn-blue:hover {
          box-shadow: 0 8px 25px rgba(59,130,246,0.5);
        }
        
        .btn-green:hover {
          box-shadow: 0 8px 25px rgba(16,185,129,0.5);
        }
      `}</style>

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Property Card */}
        <div
          className="property-card"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            position: "relative"
          }}
        >

          {/* Image / Wanted Placeholder */}
          <div
            style={{
              width: "100%",
              height: "240px",
              background: `url(${imageUrl}) center/cover`,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >

            {/* Wanted Icon Overlay */}
            {isWanted && (
              <div style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
                color: "white"
              }}>
                <FaSearch />
              </div>
            )}

            {/* Badge */}
            <PropertyTypeBadge type={property.type} />

            {/* Price */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                padding: "8px 20px",
                borderRadius: "12px",
                color: "white",
                fontWeight: "800",
                fontSize: "14px"
              }}
            >
              {isWanted 
                ? property.price // Already formatted as "من X إلى Y"
                : `${property.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ريال`
              }
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "24px" }}>
            <h3
              style={{
                fontSize: "1.6rem",
                fontWeight: "800",
                color: colors.accent,
                marginBottom: "12px"
              }}
            >
              {property.title}
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", marginBottom: "12px" }}>
              <FaMapMarkerAlt />
              <span>{property.location}</span>
            </div>

            {/* Category Badge */}
            <div style={{ marginBottom: "16px" }}>
              <span style={{
                padding: "6px 16px",
                borderRadius: "8px",
                background: "rgba(96,165,250,0.15)",
                color: colors.accent,
                fontSize: "0.9rem",
                fontWeight: "600"
              }}>
                {getCategoryLabel(property.category)}
              </span>
            </div>

            {/* Features - Only show if not wanted or if values exist */}
            {!isWanted && (
              <div style={{ display: "flex", gap: "16px", marginTop: "16px", color: "#94a3b8", flexWrap: "wrap" }}>
                {property.rooms && (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaBed /> {property.rooms} غرف
                  </span>
                )}
                {property.bathrooms && (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaBath /> {property.bathrooms} حمامات
                  </span>
                )}
                {property.area && (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaRulerCombined /> {property.area} م²
                  </span>
                )}
              </div>
            )}

            {/* Wanted Info Message */}
            {isWanted && (
              <div style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
                fontSize: "0.95rem",
                marginTop: "16px"
              }}>
                 هذا إعلان "مطلوب" - للتواصل مع المعلن للحصول على التفاصيل
              </div>
            )}

            {/* Description - Only for non-wanted */}
            {!isWanted && property.description && (
              <p style={{
                color: "#cbd5e1",
                fontSize: "0.95rem",
                marginTop: "12px",
                lineHeight: "1.6",
                maxHeight: "60px",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {property.description}
              </p>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>

              {/* تفاصيل */}
              <a
                href={`/property/${property._id || property.id}`}
                className="btn-hover btn-purple"
                style={{
                  flex: 1,
                  minWidth: "110px",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "white",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                <FaEye /> تفاصيل
              </a>

              {/* اتصال */}
              <a
                href="tel:0539416401"
                className="btn-hover btn-blue"
                style={{ 
                  flex: 1,
                  minWidth: "110px",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "white",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #1e40af, #3b82f6)",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                <FaPhoneAlt /> اتصل
              </a>

              {/* واتساب */}
              <a
                href="https://wa.me/966539416401" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover btn-green"
                style={{ 
                  flex: 1,
                  minWidth: "110px",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "white",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                <FaWhatsapp /> واتساب
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// Helper function for category labels
const getCategoryLabel = (category) => {
  const labels = {
    villa: 'فيلا',
    apartment: 'شقة',
    commercial: 'تجاري',
    building: 'عمارة',
    land: 'أرض',
    floor: 'دور',
    resthouse: 'استراحة'
  };
  return labels[category] || category;
};

export default Cart;