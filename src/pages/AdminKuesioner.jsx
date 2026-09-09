import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useKuesioner, seedKuesionerToFirestore } from '../hooks/useKuesioner';

export default function AdminKuesioner() {
  const { kuesionerList, loading, deleteKuesioner } = useKuesioner();
  const [deleting, setDeleting] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState('');

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin hapus kuesioner "${title}"?`)) return;
    setDeleting(id);
    try {
      await deleteKuesioner(id);
      setMsg(`Kuesioner "${title}" berhasil dihapus.`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Gagal menghapus: ' + err.message);
    }
    setDeleting(null);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const seeded = await seedKuesionerToFirestore();
      setMsg(seeded ? 'Data kuesioner berhasil disinkronisasi ke Firestore!' : 'Semua data kuesioner sudah tersinkronisasi.');
    } catch (err) {
      setMsg('Gagal seed: ' + err.message);
    }
    setSeeding(false);
    setTimeout(() => setMsg(''), 4000);
  };

  if (loading) return <div style={{ padding: '20px', color: '#888' }}>Memuat data kuesioner...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '4px' }}>📝 Kelola Kuesioner</h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Tambah, edit, atau hapus formulir kuesioner</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            to="/admin/kuesioner/hasil"
            style={{
              padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #0284c7',
              background: '#f0f9ff', color: '#0284c7', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem',
            }}
          >
            📊 Lihat Hasil Responden
          </Link>
          <button
            onClick={handleSeed}
            disabled={seeding}
            style={{
              padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #18804e',
              background: 'white', color: '#18804e', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem',
              opacity: seeding ? 0.5 : 1,
            }}
          >
            {seeding ? '⏳ Mengunggah...' : '📤 Seed ke Firestore'}
          </button>
          <Link
            to="/admin/kuesioner/tambah"
            style={{
              padding: '10px 20px', borderRadius: '10px', background: '#18804e', color: 'white',
              textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
          >
            ＋ Tambah Kuesioner
          </Link>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem' }}>
          {msg}
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8faf9', borderBottom: '2px solid #e5e7eb' }}>
              <th style={thStyle}>ID / Urutan</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Judul & Deskripsi</th>
              <th style={thStyle}>Tipe</th>
              <th style={thStyle}>Jml. Pertanyaan</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kuesionerList.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                  Belum ada kuesioner. Klik "Tambah Kuesioner" atau "Seed ke Firestore".
                </td>
              </tr>
            ) : (
              kuesionerList.map((k) => (
                <tr key={k.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={tdStyle}>{k.id} <br/><span style={{fontSize:'0.8rem', color:'#aaa'}}>(Order: {k.order})</span></td>
                  <td style={{ ...tdStyle, textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: '#18312a' }}>{k.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>{k.desc}</div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                      {k.type}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold' }}>
                    {k.type === 'form' ? k.fields?.length : k.questions?.length}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Link
                        to={`/admin/kuesioner/edit/${k.id}`}
                        style={{
                          padding: '6px 14px', borderRadius: '8px', background: '#eaf4fe', color: '#0056b3',
                          textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
                        }}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(k.id, k.title)}
                        disabled={deleting === k.id}
                        style={{
                          padding: '6px 14px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626',
                          border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                          opacity: deleting === k.id ? 0.5 : 1,
                        }}
                      >
                        {deleting === k.id ? '...' : '🗑️ Hapus'}
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

const thStyle = { padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#666', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { padding: '14px 16px', fontSize: '0.9rem' };
