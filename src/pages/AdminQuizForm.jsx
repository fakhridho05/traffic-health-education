import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';

const emptyForm = {
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  order: 1
};

export default function AdminQuizForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { questions, loading, addQuestion, updateQuestion } = useQuiz();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isEdit && !loading) {
      const q = questions.find(item => item.id === id);
      if (q) setForm(q);
    }
  }, [id, isEdit, loading, questions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim()) { setMsg('Pertanyaan wajib diisi!'); return; }
    
    setSaving(true);
    setMsg('');
    try {
      if (isEdit) {
        await updateQuestion(id, form);
        setMsg('✅ Soal berhasil diperbarui!');
      } else {
        await addQuestion({ ...form, order: questions.length + 1 });
        setMsg('✅ Soal baru berhasil ditambahkan!');
        setTimeout(() => navigate('/admin/quiz'), 1500);
      }
    } catch (err) {
      setMsg('❌ Gagal: ' + err.message);
    }
    setSaving(false);
  };

  if (isEdit && loading) return <div style={{ padding: '20px' }}>Memuat...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '10px', maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/admin/quiz" style={{ color: '#555', textDecoration: 'none', fontWeight: 600, marginBottom: '16px', display: 'inline-block' }}>
        &lt; Kembali ke Daftar Soal
      </Link>

      <h1 style={{ fontSize: '1.8rem', color: '#18312a', marginBottom: '16px' }}>
        {isEdit ? '✏️ Edit Soal' : '➕ Tambah Soal'}
      </h1>

      {msg && <div style={{ padding: '12px', background: '#f0fdf4', color: '#166534', borderRadius: '8px', marginBottom: '16px' }}>{msg}</div>}

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Pertanyaan</label>
          <textarea
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Pilihan Jawaban</label>
          {form.options.map((opt, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <input
                type="radio"
                name="correctAnswer"
                checked={form.correctAnswer === idx}
                onChange={() => setForm({ ...form, correctAnswer: idx })}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: 'bold', width: '20px' }}>{String.fromCharCode(65 + idx)}.</span>
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOpts = [...form.options];
                  newOpts[idx] = e.target.value;
                  setForm({ ...form, options: newOpts });
                }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                required
              />
            </div>
          ))}
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '8px' }}>
            Pilih (klik radio button) pada pilihan yang merupakan <strong>Jawaban Benar</strong>.
          </p>
        </div>

        <button type="submit" disabled={saving} style={{ padding: '12px 24px', background: '#18804e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
          {saving ? 'Menyimpan...' : 'Simpan Soal'}
        </button>
      </form>
    </div>
  );
}
