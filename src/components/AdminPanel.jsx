// src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { apiUrl } from "../api";

/*
  لوحة إدارة بسيطة للمبتدئين:
  - تعرض قائمة الإعلانات (GET /api/ads)
  - تتيح إنشاء إعلان جديد (POST /api/ads)
  - تعديل وإزالة إعلان (PUT /api/ads/:id , DELETE /api/ads/:id)
  - تفتح Cloudinary upload widget لرفع الصور (unsigned preset)
  - تحفظ التوكن الموجود في localStorage باسم "token"
*/

export default function AdminPanel() {
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);
  const [selected, setSelected] = useState(null); // الإعلان الذي نعدّله (أو null => جديد)
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState({ heroTitle: "", heroSubtitle: "" }); // مثال لإعدادات عامة

  // جلب الإعلانات من السيرفر
  const fetchAds = async () => {
    setLoadingAds(true);
    try {
      const res = await fetch(apiUrl("/api/ads"));
      if (!res.ok) throw new Error("فشل تحميل الإعلانات");
      const data = await res.json();
      setAds(Array.isArray(data) ? data : (data.ads || []));
    } catch (err) {
      console.error(err);
      setMessage("خطأ في تحميل الإعلانات: " + err.message);
    } finally {
      setLoadingAds(false);
    }
  };

  useEffect(() => { fetchAds(); }, []);

  // فتح Cloudinary widget لرفع الصور (unsigned)
  const openCloudinaryWidget = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!window.cloudinary) {
      alert("أداة Cloudinary غير محمّلة. تأكد من إضافة السكربت في index.html");
      return;
    }
    const widget = window.cloudinary.createUploadWidget({
      cloudName,
      uploadPreset,
      sources: ['local','url','camera'],
      multiple: true,
      maxFiles: 10,
      folder: "aqarjed/uploads",
      clientAllowedFormats: ["png","jpg","jpeg","webp"]
    }, (err, info) => {
      if (err) { console.error("Cloudinary widget error:", err); return; }
      if (info && info.event === "success") {
        // عند نجاح رفع ملف واحد - نحفظ رابطه في الحقل images للإعلان الجاري تحريره
        const url = info.info.secure_url;
        setSelected(prev => {
          const images = prev ? (prev.images || []) : [];
          return { ...(prev || {}), images: [...images, url] };
        });
      }
    });
    widget.open();
  };

  // حذف صورة من الإعلان الجاري تحريره
  const removeImageFromSelected = (idx) => {
    setSelected(prev => ({ ...prev, images: (prev.images || []).filter((_,i)=>i!==idx) }));
  };

  // فتح نموذج جديد
  const newAd = () => setSelected({ title: "", price: "", location: "", description: "", images: [] });

  // حفظ (إنشاء أو تحديث)
  const saveAd = async (e) => {
    e && e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const method = selected._id ? "PUT" : "POST";
      const url = selected._id ? apiUrl(`/api/ads/${selected._id}`) : apiUrl("/api/ads");
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "Bearer null"
        },
        body: JSON.stringify(selected)
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({ error: "failed" }));
        throw new Error(err.error || `خطأ في ${method}`);
      }
      setMessage("تم الحفظ بنجاح");
      setSelected(null);
      await fetchAds();
    } catch (err) {
      console.error(err);
      setMessage("خطأ أثناء الحفظ: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // حذف إعلان
  const deleteAd = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الإعلان؟")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl(`/api/ads/${id}`), {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "Bearer null" }
      });
      if (!res.ok) throw new Error("فشل الحذف");
      setMessage("تم الحذف");
      fetchAds();
    } catch (err) {
      console.error(err);
      setMessage("خطأ عند الحذف: " + err.message);
    }
  };

  // تحميل/حفظ إعدادات الموقع (نموذجي - يتطلب endpoint في backend)
  const loadSettings = async () => {
    try {
      const res = await fetch(apiUrl("/api/settings"));
      if (!res.ok) return;
      const data = await res.json();
      setSettings(data || {});
    } catch (err) {
      console.warn("لا توجد إعدادات أو فشل التحميل", err);
    }
  };
  useEffect(()=>{ loadSettings(); },[]);

  const saveSettings = async (e) => {
    e && e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/settings"), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "Bearer null" },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error("فشل حفظ الإعدادات");
      setMessage("تم حفظ الإعدادات");
    } catch (err) {
      setMessage("خطأ حفظ الإعدادات: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "8px auto", fontFamily: "Tajawal, sans-serif" }}>
      <h1>لوحة الإدارة — AqarJeddah</h1>
      <div style={{ marginBottom: 12 }}>{message && <div style={{ color: "green" }}>{message}</div>}</div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* left: قائمة الإعلانات */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>قائمة الإعلانات</h3>
            <div>
              <button onClick={newAd} style={{ marginRight: 8 }}>إضافة جديد</button>
              <button onClick={fetchAds}>تحديث</button>
            </div>
          </div>

          {loadingAds ? <div>جاري التحميل...</div> : (
            <div style={{ marginTop: 12 }}>
              {ads.length === 0 && <div>لا توجد إعلانات</div>}
              {ads.map(ad => (
                <div key={ad._id || ad.id} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, marginBottom: 10, background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{ad.title || ad.name || "بدون عنوان"}</div>
                      <div style={{ color: "#666", fontSize: 13 }}>{ad.location || ""} — {ad.price || ""}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={()=>setSelected(ad)}>تعديل</button>
                      <button onClick={()=>deleteAd(ad._id || ad.id)} style={{ color: "red" }}>حذف</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* right: نموذج الإضافة/التعديل + إعدادات */}
        <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8 }}>
          <h3>{selected && selected._id ? "تعديل إعلان" : "إضافة إعلان جديد"}</h3>

          <div style={{ marginBottom: 8 }}>
            <label>العنوان</label><br/>
            <input value={selected?.title || ""} onChange={e=>setSelected(prev=>({...prev, title: e.target.value}))} style={{ width: "100%" }} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>السعر</label><br/>
            <input value={selected?.price || ""} onChange={e=>setSelected(prev=>({...prev, price: e.target.value}))} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>الموقع</label><br/>
            <input value={selected?.location || ""} onChange={e=>setSelected(prev=>({...prev, location: e.target.value}))} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>الوصف</label><br/>
            <textarea value={selected?.description || ""} onChange={e=>setSelected(prev=>({...prev, description: e.target.value}))} rows={4} style={{ width: "100%" }} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>الصور</label><br/>
            <div style={{ display: "flex", gap: 8, margin: "8px 0", flexWrap: "wrap" }}>
              {(selected?.images || []).map((u,i)=>(
                <div key={i} style={{ position: "relative" }}>
                  <img src={u} alt={`img-${i}`} style={{ width: 110, height: 70, objectFit: "cover", borderRadius: 6 }} />
                  <button onClick={()=>removeImageFromSelected(i)} style={{ position: "absolute", top: 4, left: 4 }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={openCloudinaryWidget}>رفع صور (Cloudinary)</button>
              <button onClick={()=>setSelected(prev=>({...prev, images: [...(prev?.images||[]), "https://via.placeholder.com/300"]}))}>إضافة صورة تجريبية</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={saveAd} disabled={saving}>{saving ? "جاري الحفظ..." : (selected?._id ? "حفظ التعديل" : "إنشاء إعلان")}</button>
            <button onClick={()=>setSelected(null)}>إلغاء</button>
          </div>

          <hr style={{ margin: "16px 0" }} />

          <h4>إعدادات الصفحة الرئيسية</h4>
          <form onSubmit={saveSettings}>
            <div style={{ marginBottom: 8 }}>
              <label>عنوان الهيرو</label><br/>
              <input value={settings.heroTitle || ""} onChange={e=>setSettings(prev=>({...prev, heroTitle: e.target.value}))} style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>جملة توضيحية</label><br/>
              <input value={settings.heroSubtitle || ""} onChange={e=>setSettings(prev=>({...prev, heroSubtitle: e.target.value}))} style={{ width: "100%" }} />
            </div>
            <button type="submit">حفظ إعدادات</button>
          </form>
        </div>
      </div>
    </div>
  );
}
