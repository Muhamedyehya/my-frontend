// src/pages/PropertyDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaDollarSign,
  FaImage, FaTimes, FaEdit, FaTrash, FaSave, FaSignOutAlt, FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000';

const PropertyDetailsPage = ( ) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [propertyData, setPropertyData] = useState({
    id: '',
    title: '',
    type: '',
    category: '',
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

  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const isWanted = propertyData.type === 'wanted';

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


  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ads/${id}`);
      if (!res.ok) throw new Error('فشل في جلب بيانات العقار');
      const data = await res.json();
      const ad = data.ad || data;

      console.log('📊 البيانات الكاملة:', ad);

      const processedImages = Array.isArray(ad.images)
        ? ad.images.map(img =>
            typeof img === 'string' && (img.startsWith('http' ) || img.startsWith('data:'))
              ? img
              : `${API_BASE}/uploads/${img}`
          )
        : [];

      setPropertyData({
        id: ad._id || id,
        title: ad.title || '',
        type: ad.type || '',
        category: ad.category || '',
        price: ad.price ? String(ad.price) : '',
        priceFrom: ad.priceFrom ? String(ad.priceFrom) : '',
        priceTo: ad.priceTo ? String(ad.priceTo) : '',
        location: ad.location || '',
        area: ad.area ? String(ad.area) : '',
        rooms: ad.rooms ? String(ad.rooms) : '',
        bathrooms: ad.bathrooms ? String(ad.bathrooms) : '',
        description: ad.description || '',
        phone: ad.phone || '',
        whatsapp: ad.whatsapp || '',
        images: processedImages
      });

    } catch (err) {
      console.error('❌ خطأ:', err);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء جلب بيانات العقار' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const base64Images = await Promise.all(files.map(fileToBase64));
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews]);
    setNewImages(prev => [...prev, ...base64Images]);
  };

  const removeExistingImage = (index) => {
    setPropertyData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeNewImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const allImages = isWanted ? [] : [...propertyData.images, ...newImages];
      const updateData = { ...propertyData, images: allImages };

      const res = await fetch(`${API_BASE}/api/ads/${propertyData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) throw new Error();
      setMessage({ type: 'success', text: 'تم التحديث بنجاح' });
      setIsEditMode(false);
      fetchPropertyData();
    } catch {
      setMessage({ type: 'error', text: 'فشل في التحديث' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    await fetch(`${API_BASE}/api/ads/${propertyData.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    window.location.href = '/loginPage';
  };

  const getCategoryLabel = (cat) => {
    const map = {
      villa: 'فيلا',
      apartment: 'شقة',
      commercial: 'تجاري',
      land: 'أرض',
      floor: 'دور',
      resthouse: 'استراحة'
    };
    return map[cat] || cat;
  };
  
  // *** START: Helper component for input fields ***
  const FormInput = ({ name, value, icon, label, unit, readOnly, ...props }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: `1px solid ${readOnly ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.5)'}`,
      borderRadius: 16,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      transition: 'border 0.3s ease'
    }}>
      {icon}
      <div style={{ flexGrow: 1 }}>
        {label && <label style={{ fontSize: 14, color: '#94a3b8', display: 'block', marginBottom: 4 }}>{label}</label>}
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          readOnly={readOnly}
          style={{
            background: 'transparent',
            border: 'none',
            color: colors.text,
            width: '100%',
            fontSize: 18,
            fontWeight: 600,
            outline: 'none',
            cursor: readOnly ? 'default' : 'text'
          }}
          {...props}
        />
      </div>
      {unit && <span style={{ color: '#94a3b8' }}>{unit}</span>}
    </div>
  );
  // *** END: Helper component for input fields ***


  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        color: "#fff"
      }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      minHeight: "100vh",
      padding: "30px 20px",
      direction: "rtl",
      color: colors.text,
      fontFamily: "'Tajawal', sans-serif"
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ ...glassCardStyle, marginBottom: 20, borderTop: `6px solid ${colors.secondary}`, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              {isEditMode ? (
                 <FormInput
                    name="title"
                    value={propertyData.title}
                    readOnly={!isEditMode}
                    style={{ fontSize: 28, color: colors.accent, padding: 0 }}
                 />
              ) : (
                <h1 style={{ margin: 0, color: colors.accent, fontSize: 28 }}>
                    {propertyData.title}
                </h1>
              )}
              <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>
                {!isEditMode && (
                  <>
                    {getCategoryLabel(propertyData.category)} • 
                    <span style={{ 
                      display: 'inline-block',
                      marginRight: 8,
                      padding: '4px 12px',
                      borderRadius: 8,
                      fontWeight: 700,
                      background: propertyData.type === 'sale' 
                        ? 'linear-gradient(135deg,#1e40af,#3b82f6)' 
                        : propertyData.type === 'rent'
                        ? 'linear-gradient(135deg,#059669,#10b981)'
                        : 'linear-gradient(135deg,#dc2626,#ef4444)',
                      color: 'white'
                    }}>
                      {propertyData.type === 'sale'
                        ? 'للبيع'
                        : propertyData.type === 'rent'
                        ? 'للإيجار'
                        : 'مطلوب'
                      }
                    </span>
                  </>
                )}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: "8px 16px",
                  color: colors.text,
                  cursor: "pointer"
                }}
              >
                <FaArrowLeft /> رجوع
              </button>

              {isAdmin && (
                <button
                  onClick={handleLogout}
                  style={{
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    borderRadius: 12,
                    padding: "8px 16px",
                    color: "#fecaca",
                    cursor: "pointer"
                  }}
                >
                  <FaSignOutAlt /> خروج
                </button>
              )}
            </div>
          </div>
        </div>

        {/* رسائل */}
        {message.text && (
          <div style={{ ...glassCardStyle, padding: 16, marginBottom: 20 }}>
            {message.text}
          </div>
        )}

        {/* Admin Buttons */}
        {isAdmin && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            {!isEditMode ? (
              <button 
                onClick={() => setIsEditMode(true)}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 16,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                }}
              >
                <FaEdit /> تعديل العقار
              </button>
            ) : (
              <button 
                onClick={() => {
                  setIsEditMode(false);
                  setNewImages([]);
                  imagePreviews.forEach(u => URL.revokeObjectURL(u));
                  setImagePreviews([]);
                  fetchPropertyData();
                }}
                style={{
                  padding: '14px 28px',
                  background: '#64748b',
                  color: 'white',
                  border: 'none',
                  borderRadius: 16,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(100, 116, 139, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(100, 116, 139, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(100, 116, 139, 0.3)';
                }}
              >
                <FaTimes /> إلغاء التعديل
              </button>
            )}

            <button 
              onClick={handleDelete}
              disabled={saveLoading}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                color: 'white',
                border: 'none',
                borderRadius: 16,
                cursor: saveLoading ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.3s ease',
                opacity: saveLoading ? 0.7 : 1,
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!saveLoading) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(239, 68, 68, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!saveLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                }
              }}
            >
              <FaTrash /> حذف العقار
            </button>

            {isEditMode && (
              <button 
                onClick={handleUpdate}
                disabled={saveLoading}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 16,
                  cursor: saveLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s ease',
                  opacity: saveLoading ? 0.7 : 1,
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                  marginLeft: 'auto'
                }}
                onMouseEnter={(e) => {
                  if (!saveLoading) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saveLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }
                }}
              >
                {saveLoading ? 'جاري الحفظ...' : <><FaSave /> حفظ التغييرات</>}
              </button>
            )}
          </div>
        )}

        {/* Main Card */}
        <div style={{ ...glassCardStyle, padding: 32 }}>

          {/* Images */}
          {!isWanted && (
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ color: colors.accent }}>
                <FaImage /> معرض الصور
              </h3>

              {propertyData.images.length > 0 || isEditMode ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
                  {propertyData.images.map((img, idx) => (
                    <div key={`existing-${idx}`} style={{ position: 'relative' }}>
                      <img src={img} alt={`property ${idx}`} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 12 }} />
                      {isEditMode && (
                        <button onClick={() => removeExistingImage(idx)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', borderRadius: '50%', cursor: 'pointer', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTimes /></button>
                      )}
                    </div>
                  ))}
                  {imagePreviews.map((img, idx) => (
                     <div key={`new-${idx}`} style={{ position: 'relative' }}>
                      <img src={img} alt={`preview ${idx}`} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 12 }} />
                      {isEditMode && (
                        <button onClick={() => removeNewImage(idx)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', borderRadius: '50%', cursor: 'pointer', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTimes /></button>
                      )}
                    </div>
                  ))}
                   {isEditMode && (
                    <label style={{ height: 150, border: `2px dashed ${colors.accent}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: 'pointer', color: colors.accent }}>
                      <FaImage size={32} />
                      <span>إضافة صور</span>
                      <input type="file" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              ) : (
                <p>لا توجد صور</p>
              )}
            </div>
          )}

          {/* Details */}
          <div style={{ display: 'grid', gap: 24 }}>

            {/* Price */}
            {isWanted ? (
                 <div style={{ display: 'flex', gap: 16 }}>
                    <FormInput name="priceFrom" value={propertyData.priceFrom} readOnly={!isEditMode} icon={<FaDollarSign style={{ color: '#93c5fd' }} />} label="السعر من" unit="ريال" />
                    <FormInput name="priceTo" value={propertyData.priceTo} readOnly={!isEditMode} icon={<FaDollarSign style={{ color: '#93c5fd' }} />} label="السعر إلى" unit="ريال" />
                 </div>
            ) : (
                <FormInput name="price" value={propertyData.price} readOnly={!isEditMode} icon={<FaDollarSign style={{ color: '#93c5fd' }} />} label="السعر" unit="ريال" />
            )}

            {/* Location */}
            <FormInput name="location" value={propertyData.location} readOnly={!isEditMode} icon={<FaMapMarkerAlt style={{ color: '#a5b4fc' }} />} label="الموقع" />

            {/* Stats */}
            {!isWanted && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', 
                gap: 16 
              }}>
                <FormInput name="area" value={propertyData.area} readOnly={!isEditMode} icon={<FaRulerCombined style={{ color: '#fcd34d' }} />} label="المساحة" unit="م²" />
                <FormInput name="rooms" value={propertyData.rooms} readOnly={!isEditMode} icon={<FaBed style={{ color: '#f9a8d4' }} />} label="الغرف" unit="غرف" />
                <FormInput name="bathrooms" value={propertyData.bathrooms} readOnly={!isEditMode} icon={<FaBath style={{ color: '#7dd3fc' }} />} label="الحمامات" unit="حمام" />
              </div>
            )}

            {/* Description */}
            {!isWanted && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 16,
                padding: 24,
                border: `1px solid ${!isEditMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.5)'}`
              }}>
                <div style={{ 
                  color: colors.accent, 
                  marginBottom: 12,
                  fontSize: 18,
                  fontWeight: 700
                }}>
                  الوصف التفصيلي
                </div>
                <textarea
                  name="description"
                  value={propertyData.description}
                  onChange={handleInputChange}
                  readOnly={!isEditMode}
                  style={{
                    fontSize: 16, 
                    lineHeight: 1.8,
                    color: '#cbd5e1',
                    background: 'transparent',
                    border: 'none',
                    width: '100%',
                    minHeight: '120px',
                    resize: 'vertical',
                    outline: 'none',
                    cursor: !isEditMode ? 'default' : 'text'
                  }}
                />
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;



