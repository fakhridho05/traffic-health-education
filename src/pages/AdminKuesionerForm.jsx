import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useKuesioner } from '../hooks/useKuesioner';

const emptyForm = {
  id: '', title: '', desc: '', type: 'likert', order: 1,
  options: ['Sangat Tidak Setuju', 'Tidak Setuju', 'Ragu-ragu', 'Setuju', 'Sangat Setuju'],
  questions: [''],
  fields: [] // For 'form' type
};

export default function AdminKuesionerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { kuesionerList, kuesionerMap, loading: dataLoading, addKuesioner, updateKuesioner } = useKuesioner();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isEdit && !dataLoading && kuesionerMap[id]) {
      setForm({ ...emptyForm, ...kuesionerMap[id] });
    }
  }, [id, isEdit, dataLoading, kuesionerMap]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, idx, value) => {
    const arr = [...(form[field] || [])];
    arr[idx] = value;
    handleChange(field, arr);
  };

  const addArrayItem = (field, defaultValue = '') => {
    handleChange(field, [...(form[field] || []), defaultValue]);
  };

  const removeArrayItem = (field, idx) => {
    handleChange(field, (form[field] || []).filter((_, i) => i !== idx));
  };

  // Khusus multiple_choice questions yang berbentuk object {q, options}
  const handleMcqChange = (idx, qField, value) => {
    const arr = [...(form.questions || [])];
    if (typeof arr[idx] === 'string') {
      arr[idx] = { q: '', options: ['', '', '', ''] };
    }
    arr[idx] = { ...arr[idx], [qField]: value };
    handleChange('questions', arr);
  };
  
  const handleMcqOptionChange = (qIdx, optIdx, value) => {
    const arr = [...(form.questions || [])];
    const opts = [...(arr[qIdx].options || [])];
    opts[optIdx] = value;
    arr[qIdx] = { ...arr[qIdx], options: opts };
    handleChange('questions', arr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setMsg('Judul wajib diisi!'); return; }
    
    setSaving(true);
    setMsg('');
    try {
      if (isEdit) {
        await updateKuesioner(id, form);
        setMsg('✅ Kuesioner diperbarui!');
      } else {
        const nextId = form.id || `kuesioner_${kuesionerList.length + 1}`;
        await addKuesioner({ ...form, id: nextId });
        setMsg('✅ Kuesioner ditambahkan!');
        setTimeout(() => navigate('/admin/kuesioner'), 1500);
      }
    } catch (err) {
      setMsg('❌ Gagal: ' + err.message);
    }
    setSaving(false);
  };

  if (isEdit && dataLoading) return <div style={{ padding: '20px' }}>Memuat...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '10px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/admin/kuesioner" style={{ color: '#555', textDecoration: 'none', fontWeight: 600, marginBottom: '16px', display: 'inline-block' }}>
        &lt; Kembali ke Daftar Kuesioner
      </Link>

      <h1 style={{ fontSize: '1.8rem', color: '#18312a', marginBottom: '6px' }}>
        {isEdit ? `✏️ Edit Kuesioner: ${form.title}` : '➕ Tambah Kuesioner'}
      </h1>

      {msg && <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', background: msg.startsWith('✅') ? '#f0fdf4' : '#fef2f2', border: msg.startsWith('✅') ? '1px solid #86efac' : '1px solid #fecaca', color: msg.startsWith('✅') ? '#166534' : '#dc2626' }}>{msg}</div>}

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: '1' }}>
            <label style={labelStyle}>ID Kuesioner (Tanpa spasi)</label>
            <input type="text" value={form.id} onChange={(e) => handleChange('id', e.target.value)} disabled={isEdit} style={{ ...inputStyle, opacity: isEdit ? 0.5 : 1 }} required />
          </div>
          <div style={{ flex: '1' }}>
            <label style={labelStyle}>Urutan Tampil</label>
            <input type="number" value={form.order} onChange={(e) => handleChange('order', parseInt(e.target.value)||1)} style={inputStyle} required />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Judul Kuesioner</label>
          <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} style={inputStyle} required />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Deskripsi / Instruksi</label>
          <textarea value={form.desc} onChange={(e) => handleChange('desc', e.target.value)} style={{ ...inputStyle, minHeight: '80px' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Tipe Kuesioner</label>
          <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} style={inputStyle}>
            <option value="likert">Likert Scale (Pertanyaan dengan skala yang sama)</option>
            <option value="multiple_choice">Pilihan Ganda (Opsi berbeda tiap pertanyaan)</option>
            <option value="form">Formulir (Input data diri, dsb)</option>
          </select>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '24px 0' }} />

        {/* --- Editor berdasarkan tipe --- */}
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Daftar Pertanyaan / Field</h3>

        {form.type === 'likert' && (
          <div>
            <div style={{ marginBottom: '20px', padding: '16px', background: '#f8faf9', borderRadius: '12px' }}>
              <label style={labelStyle}>Opsi Jawaban Global (Misal: Sangat Tidak Setuju - Sangat Setuju)</label>
              {(form.options || []).map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" value={opt} onChange={(e) => handleArrayChange('options', idx, e.target.value)} style={inputStyle} />
                  <button type="button" onClick={() => removeArrayItem('options', idx)} style={delBtn}>✕</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('options', '')} style={addBtn}>+ Tambah Opsi</button>
            </div>

            <label style={labelStyle}>Pertanyaan-Pertanyaan</label>
            {(form.questions || []).map((q, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', width: '20px', color: '#888' }}>{idx + 1}.</span>
                <input type="text" value={q} onChange={(e) => handleArrayChange('questions', idx, e.target.value)} style={inputStyle} />
                <button type="button" onClick={() => removeArrayItem('questions', idx)} style={delBtn}>✕</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('questions', '')} style={addBtn}>+ Tambah Pertanyaan</button>
          </div>
        )}

        {form.type === 'multiple_choice' && (
          <div>
             {(form.questions || []).map((qObj, idx) => {
               const questionText = typeof qObj === 'string' ? qObj : qObj.q;
               const options = typeof qObj === 'string' ? ['', '', '', ''] : (qObj.options || []);
               
               return (
                <div key={idx} style={{ marginBottom: '20px', padding: '16px', border: '1px solid #eee', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={labelStyle}>Pertanyaan {idx + 1}</label>
                    <button type="button" onClick={() => removeArrayItem('questions', idx)} style={{...delBtn, padding: '4px 8px', fontSize: '0.8rem'}}>Hapus Pertanyaan</button>
                  </div>
                  <input type="text" value={questionText} onChange={(e) => handleMcqChange(idx, 'q', e.target.value)} style={{...inputStyle, marginBottom: '12px'}} placeholder="Tulis pertanyaan di sini..." />
                  
                  <div style={{ paddingLeft: '16px' }}>
                    <label style={{...labelStyle, fontSize: '0.75rem', color: '#888'}}>Opsi Jawaban:</label>
                    {options.map((opt, optIdx) => (
                      <div key={optIdx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ color: '#aaa', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>{String.fromCharCode(65 + optIdx)}.</span>
                        <input type="text" value={opt} onChange={(e) => handleMcqOptionChange(idx, optIdx, e.target.value)} style={{...inputStyle, padding: '6px 10px'}} />
                      </div>
                    ))}
                  </div>
                </div>
               );
             })}
             <button type="button" onClick={() => addArrayItem('questions', {q: '', options: ['', '', '', '']})} style={addBtn}>+ Tambah Soal Pilihan Ganda</button>
          </div>
        )}

        {form.type === 'form' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>Kuesioner tipe ini digunakan untuk input data diri (seperti nama, umur, dsb).</p>
            {(form.fields || []).map((field, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="text" placeholder="Field ID (cth: nama_ibu)" value={field.id || ''} onChange={(e) => {
                    const newFields = [...form.fields]; newFields[idx] = { ...newFields[idx], id: e.target.value }; handleChange('fields', newFields);
                  }} style={inputStyle} />
                  <input type="text" placeholder="Label (cth: Nama Ibu)" value={field.label || ''} onChange={(e) => {
                    const newFields = [...form.fields]; newFields[idx] = { ...newFields[idx], label: e.target.value }; handleChange('fields', newFields);
                  }} style={inputStyle} />
                  <select value={field.type || 'text'} onChange={(e) => {
                    const newFields = [...form.fields]; newFields[idx] = { ...newFields[idx], type: e.target.value }; handleChange('fields', newFields);
                  }} style={inputStyle}>
                    <option value="text">Teks Singkat</option>
                    <option value="number">Angka</option>
                    <option value="select">Dropdown (Select)</option>
                  </select>
                </div>
                <button type="button" onClick={() => removeArrayItem('fields', idx)} style={{...delBtn, alignSelf: 'flex-start'}}>✕</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('fields', {id: '', label: '', type: 'text'})} style={addBtn}>+ Tambah Field</button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
          <button type="submit" disabled={saving} style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', background: '#18804e', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Menyimpan...' : '💾 Simpan Kuesioner'}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #d1d5db', fontSize: '0.92rem', outline: 'none' };
const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#444', marginBottom: '6px' };
const delBtn = { width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' };
const addBtn = { padding: '8px 16px', borderRadius: '8px', border: '1px solid #18804e', background: '#e8f5e9', color: '#18804e', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' };
