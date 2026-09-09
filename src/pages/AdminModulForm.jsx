import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useModules } from '../hooks/useModules';

const TABS = ['Info Dasar', 'Materi (Sections)', 'Video', 'Tips', 'Evaluasi'];

const emptyForm = {
  id: '',
  title: '',
  desc: '',
  videoId: '',
  tips: '',
  evaluasi: '',
  sections: [],
  order: 1,
};

// --- Section Builder Sub-Components ---
function SectionEditor({ sections, onChange }) {
  const addSection = (type) => {
    let newSection;
    switch (type) {
      case 'heading': newSection = { type: 'heading', text: '' }; break;
      case 'paragraph': newSection = { type: 'paragraph', text: '' }; break;
      case 'image': newSection = { type: 'image', url: '', alt: '' }; break;
      case 'callout': newSection = { type: 'callout', title: '', text: '' }; break;
      case 'checklist': newSection = { type: 'checklist', items: [''] }; break;
      default: return;
    }
    onChange([...sections, newSection]);
  };

  const updateSection = (idx, field, value) => {
    const updated = sections.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    onChange(updated);
  };

  const removeSection = (idx) => {
    onChange(sections.filter((_, i) => i !== idx));
  };

  const moveSection = (idx, dir) => {
    const arr = [...sections];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    onChange(arr);
  };

  // Checklist item helpers
  const addChecklistItem = (sIdx) => {
    const updated = sections.map((s, i) => {
      if (i !== sIdx) return s;
      return { ...s, items: [...s.items, ''] };
    });
    onChange(updated);
  };

  const updateChecklistItem = (sIdx, iIdx, value) => {
    const updated = sections.map((s, i) => {
      if (i !== sIdx) return s;
      const items = s.items.map((it, j) => j === iIdx ? value : it);
      return { ...s, items };
    });
    onChange(updated);
  };

  const removeChecklistItem = (sIdx, iIdx) => {
    const updated = sections.map((s, i) => {
      if (i !== sIdx) return s;
      return { ...s, items: s.items.filter((_, j) => j !== iIdx) };
    });
    onChange(updated);
  };

  const sectionTypeLabels = {
    heading: '📌 Heading',
    paragraph: '📝 Paragraf',
    image: '🖼️ Gambar',
    callout: '💡 Callout',
    checklist: '✅ Checklist',
  };

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '16px' }}>
        Bangun konten materi modul di sini. Gunakan tombol di bawah untuk menambah elemen.
      </p>

      {/* Add Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {['heading', 'paragraph', 'image', 'callout', 'checklist'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addSection(type)}
            style={{
              padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #d1d5db',
              background: 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#333',
            }}
          >
            + {sectionTypeLabels[type]}
          </button>
        ))}
      </div>

      {/* Section List */}
      {sections.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px', color: '#bbb', background: '#fafafa', borderRadius: '12px', border: '1px dashed #ddd' }}>
          Belum ada konten. Klik tombol di atas untuk menambah.
        </div>
      )}

      {sections.map((sec, idx) => (
        <div key={idx} style={{
          background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px',
          padding: '16px', marginBottom: '12px',
        }}>
          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#18804e' }}>
              #{idx + 1} — {sectionTypeLabels[sec.type] || sec.type}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" onClick={() => moveSection(idx, -1)} style={miniBtn} title="Pindah ke atas">↑</button>
              <button type="button" onClick={() => moveSection(idx, 1)} style={miniBtn} title="Pindah ke bawah">↓</button>
              <button type="button" onClick={() => removeSection(idx)} style={{ ...miniBtn, color: '#dc2626', background: '#fef2f2' }} title="Hapus">✕</button>
            </div>
          </div>

          {/* Section content editors */}
          {sec.type === 'heading' && (
            <input
              type="text" placeholder="Teks heading..."
              value={sec.text} onChange={(e) => updateSection(idx, 'text', e.target.value)}
              style={inputStyle}
            />
          )}

          {sec.type === 'paragraph' && (
            <textarea
              placeholder="Isi paragraf..."
              value={sec.text} onChange={(e) => updateSection(idx, 'text', e.target.value)}
              rows={4} style={{ ...inputStyle, resize: 'vertical' }}
            />
          )}

          {sec.type === 'image' && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text" placeholder="URL gambar (contoh: /modul-01.png atau https://...)"
                value={sec.url} onChange={(e) => updateSection(idx, 'url', e.target.value)}
                style={{ ...inputStyle, flex: '2 1 250px' }}
              />
              <input
                type="text" placeholder="Alt text..."
                value={sec.alt} onChange={(e) => updateSection(idx, 'alt', e.target.value)}
                style={{ ...inputStyle, flex: '1 1 150px' }}
              />
            </div>
          )}

          {sec.type === 'callout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text" placeholder="Judul callout..."
                value={sec.title} onChange={(e) => updateSection(idx, 'title', e.target.value)}
                style={inputStyle}
              />
              <textarea
                placeholder="Isi callout..."
                value={sec.text} onChange={(e) => updateSection(idx, 'text', e.target.value)}
                rows={3} style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          )}

          {sec.type === 'checklist' && (
            <div>
              {sec.items.map((item, iIdx) => (
                <div key={iIdx} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                  <span style={{ color: '#aaa', fontSize: '0.8rem', minWidth: '20px' }}>{iIdx + 1}.</span>
                  <input
                    type="text" placeholder={`Item ${iIdx + 1}...`}
                    value={item} onChange={(e) => updateChecklistItem(idx, iIdx, e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button type="button" onClick={() => removeChecklistItem(idx, iIdx)} style={{ ...miniBtn, color: '#dc2626', background: '#fef2f2' }}>✕</button>
                </div>
              ))}
              <button type="button" onClick={() => addChecklistItem(idx)} style={{ ...miniBtn, color: '#18804e', background: '#e8f5e9', marginTop: '6px', fontSize: '0.8rem', padding: '5px 12px' }}>
                + Tambah Item
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Main Form Component ---
export default function AdminModulForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { modules, modulesMap, loading: modulesLoading, addModule, updateModule } = useModules();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState('Info Dasar');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isEdit && !modulesLoading && modulesMap[id]) {
      setForm({ ...emptyForm, ...modulesMap[id] });
    }
  }, [id, isEdit, modulesLoading, modulesMap]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setMsg('Judul modul wajib diisi!');
      return;
    }
    setSaving(true);
    setMsg('');
    try {
      if (isEdit) {
        await updateModule(id, form);
        setMsg('✅ Modul berhasil diperbarui!');
      } else {
        // Auto-generate ID
        const nextId = String(modules.length + 1).padStart(2, '0');
        const newOrder = modules.length + 1;
        await addModule({ ...form, id: form.id || nextId, order: form.order || newOrder });
        setMsg('✅ Modul baru berhasil ditambahkan!');
        setTimeout(() => navigate('/admin/modules'), 1500);
      }
    } catch (err) {
      setMsg('❌ Gagal menyimpan: ' + err.message);
    }
    setSaving(false);
  };

  if (isEdit && modulesLoading) {
    return <div style={{ padding: '20px', color: '#888' }}>Memuat data modul...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '10px' }}>
      <Link to="/admin/modules" style={{ color: '#555', textDecoration: 'none', fontWeight: 600, marginBottom: '16px', display: 'inline-block' }}>
        &lt; Kembali ke Daftar Modul
      </Link>

      <h1 style={{ fontSize: '1.8rem', color: '#18312a', marginBottom: '6px' }}>
        {isEdit ? `✏️ Edit Modul: ${form.title || id}` : '➕ Tambah Modul Baru'}
      </h1>
      <p style={{ color: '#666', marginBottom: '24px', fontSize: '0.95rem' }}>
        {isEdit ? 'Ubah isi modul dan klik Simpan.' : 'Isi seluruh bagian modul di bawah ini, lalu klik Simpan.'}
      </p>

      {/* Tab navigation */}
      <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '24px', gap: '0', overflowX: 'auto' }}>
        {TABS.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap',
              color: activeTab === tab ? '#18804e' : '#888',
              borderBottom: activeTab === tab ? '3px solid #18804e' : '3px solid transparent',
              marginBottom: '-2px',
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {msg && (
        <div style={{
          padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem',
          background: msg.startsWith('✅') ? '#f0fdf4' : '#fef2f2',
          border: msg.startsWith('✅') ? '1px solid #86efac' : '1px solid #fecaca',
          color: msg.startsWith('✅') ? '#166534' : '#dc2626',
        }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee', marginBottom: '20px' }}>

          {/* Tab: Info Dasar */}
          {activeTab === 'Info Dasar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 0 80px' }}>
                  <label style={labelStyle}>ID Modul</label>
                  <input
                    type="text" placeholder="01"
                    value={form.id} onChange={(e) => handleChange('id', e.target.value)}
                    disabled={isEdit}
                    style={{ ...inputStyle, opacity: isEdit ? 0.5 : 1 }}
                  />
                </div>
                <div style={{ flex: '0 0 80px' }}>
                  <label style={labelStyle}>Urutan</label>
                  <input
                    type="number" placeholder="1" min="1"
                    value={form.order} onChange={(e) => handleChange('order', parseInt(e.target.value) || 1)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={labelStyle}>Judul Modul *</label>
                  <input
                    type="text" placeholder="Contoh: Mengenal Stunting"
                    value={form.title} onChange={(e) => handleChange('title', e.target.value)}
                    style={inputStyle} required
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Deskripsi Singkat</label>
                <input
                  type="text" placeholder="Deskripsi singkat modul..."
                  value={form.desc} onChange={(e) => handleChange('desc', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Tab: Materi (Sections) */}
          {activeTab === 'Materi (Sections)' && (
            <SectionEditor sections={form.sections || []} onChange={(s) => handleChange('sections', s)} />
          )}

          {/* Tab: Video */}
          {activeTab === 'Video' && (
            <div>
              <label style={labelStyle}>YouTube Video ID</label>
              <input
                type="text" placeholder="Contoh: zqpinGFvivg"
                value={form.videoId} onChange={(e) => handleChange('videoId', e.target.value)}
                style={inputStyle}
              />
              <p style={{ fontSize: '0.82rem', color: '#999', marginTop: '8px' }}>
                Ambil dari URL YouTube: https://www.youtube.com/watch?v=<strong>VIDEO_ID</strong>
              </p>
              {form.videoId && (
                <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', maxWidth: '480px' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      src={`https://www.youtube.com/embed/${form.videoId}`}
                      title="Preview Video" frameBorder="0" allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Tips */}
          {activeTab === 'Tips' && (
            <div>
              <label style={labelStyle}>Tips Praktis</label>
              <textarea
                placeholder="• Tips pertama&#10;• Tips kedua&#10;• Tips ketiga"
                value={form.tips} onChange={(e) => handleChange('tips', e.target.value)}
                rows={10} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
              <p style={{ fontSize: '0.82rem', color: '#999', marginTop: '6px' }}>
                Gunakan format bullet point (• poin). Setiap baris baru menjadi satu poin.
              </p>
            </div>
          )}

          {/* Tab: Evaluasi */}
          {activeTab === 'Evaluasi' && (
            <div>
              <label style={labelStyle}>Soal Evaluasi / Refleksi</label>
              <textarea
                placeholder="📝 Soal Refleksi 1:&#10;Pertanyaan...&#10;&#10;(Kunci: Jawaban...)&#10;&#10;📝 Soal Refleksi 2:&#10;..."
                value={form.evaluasi} onChange={(e) => handleChange('evaluasi', e.target.value)}
                rows={12} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
              <p style={{ fontSize: '0.82rem', color: '#999', marginTop: '6px' }}>
                Tulis soal refleksi dan kunci jawaban. Gunakan format "📝 Soal Refleksi N:" diikuti pertanyaan dan "(Kunci: ...)".
              </p>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Link to="/admin/modules" style={{
            padding: '12px 24px', borderRadius: '10px', border: '1.5px solid #d1d5db',
            background: 'white', color: '#666', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
          }}>
            Batal
          </Link>
          <button type="submit" disabled={saving} style={{
            padding: '12px 28px', borderRadius: '10px', border: 'none',
            background: '#18804e', color: 'white', fontWeight: 700, fontSize: '0.9rem',
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
          }}>
            {saving ? '⏳ Menyimpan...' : isEdit ? '💾 Simpan Perubahan' : '💾 Simpan Modul'}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #d1d5db',
  fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#444', marginBottom: '6px',
};

const miniBtn = {
  width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #d1d5db',
  background: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '0.85rem', fontWeight: 700, color: '#555', padding: 0,
};
