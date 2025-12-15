import React from "react";

const PropertyTypeBadge = ({ type }) => {
  const getTypeStyle = (propertyType) => {
    switch(propertyType) {
      case 'sale':
        return {
          background: "linear-gradient(135deg, #1e40af, #3b82f6)",
          label: "للبيع"
        };
      case 'rent':
        return {
          background: "linear-gradient(135deg, #059669, #10b981)",
          label: "للإيجار"
        };
      case 'wanted':
        return {
          background: "linear-gradient(135deg, #dc2626, #ef4444)",
          label: "مطلوب"
        };
      default:
        return {
          background: "linear-gradient(135deg, #64748b, #94a3b8)",
          label: "غير محدد"
        };
    }
  };

  const typeStyle = getTypeStyle(type);

  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        background: typeStyle.background,
        padding: "8px 20px",
        borderRadius: "12px",
        color: "white",
        fontWeight: "800",
        fontSize: "14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 10
      }}
    >
      {typeStyle.label}
    </div>
  );
};

export default PropertyTypeBadge;
