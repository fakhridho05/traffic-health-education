import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuiz, seedQuizToFirestore } from '../hooks/useQuiz';

export default function AdminQuiz() {
  const { questions, loading, deleteQuestion } = useQuiz();
  const [deleting, setDeleting] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState('');

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin hapus soal ID ${id}?`)) return;
    setDeleting(id);
    try {
      await deleteQuestion(id);
      setMsg(`Soal berhasil dihapus.`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Gagal menghapus: ' + err.message);
    }
    setDeleting(null);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const seeded = await seedQuizToFirestore();
      setMsg(seeded ? 'Soal bawaan berhasil diunggah ke Firestore!' : 'Semua soal sudah ada di Firestore.');
    } catch (err) {
      setMsg('Gagal seed: ' + err.message);
    }
    setSeeding(false);
    setTimeout(() => setMsg(''), 4000);
  };

  if (loading) return <div style={{ padding: '20px', color: '#888' }}>Memuat data soal...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '4px' }}>⭐ Kelola Soal Tes</h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Digunakan untuk Pre-Test & Post-Test</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            to="/admin/tes/hasil"
            style={{
              padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #0284c7',
              background: '#f0f9ff', color: '#0284c7', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem',
            }}
          >
            📊 Lihat Hasil Tes
          </Link>
          <button onClick={handleSeed} disabled={seeding} style={btnSeed}>
            {seeding ? '⏳ Mengunggah...' : '📤 Seed ke Firestore'}
          </button>
          <Link to="/admin/quiz/tambah" style={btnAdd}>＋ Tambah Soal</Link>
        </div>
      </div>

      {msg && <div style={alertStyle}>{msg}</div>}

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8faf9', borderBottom: '2px solid #e5e7eb' }}>
              <th style={thStyle}>No.</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Pertanyaan</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>Belum ada soal tes.</td>
              </tr>
            ) : (
              questions.map((q, i) => (
                <tr key={q.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold' }}>{i + 1}</td>
                  <td style={{ ...tdStyle, textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: '#18312a', marginBottom: '8px' }}>{q.question}</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#555' }}>
                      {q.options?.map((opt, idx) => (
                        <li key={idx} style={{ color: q.correctAnswer === idx ? '#166534' : 'inherit', fontWeight: q.correctAnswer === idx ? 'bold' : 'normal' }}>
                          {opt} {q.correctAnswer === idx && '✅'}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Link to={`/admin/quiz/edit/${q.id}`} style={btnEdit}>✏️ Edit</Link>
                      <button onClick={() => handleDelete(q.id)} disabled={deleting === q.id} style={btnDel}>
                        {deleting === q.id ? '...' : '🗑️ Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const btnSeed = { padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #18804e', background: 'white', color: '#18804e', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' };
const btnAdd = { padding: '10px 20px', borderRadius: '10px', background: '#18804e', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' };
const alertStyle = { padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem' };
const thStyle = { padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#666', textAlign: 'center' };
const tdStyle = { padding: '14px 16px', fontSize: '0.9rem' };
const btnEdit = { padding: '6px 14px', borderRadius: '8px', background: '#eaf4fe', color: '#0056b3', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 };
const btnDel = { padding: '6px 14px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 };
