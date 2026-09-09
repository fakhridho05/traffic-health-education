import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useModules, seedModulesToFirestore } from '../hooks/useModules';

export default function AdminModules() {
  const { modules, loading, deleteModule } = useModules();
  const [deleting, setDeleting] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState('');

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin hapus modul "${title}"?`)) return;
    setDeleting(id);
    try {
      await deleteModule(id);
      setMsg(`Modul "${title}" berhasil dihapus.`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Gagal menghapus: ' + err.message);
    }
    setDeleting(null);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const seeded = await seedModulesToFirestore();
      setMsg(seeded ? 'Data modul berhasil diunggah ke Firestore!' : 'Data modul sudah ada di Firestore.');
    } catch (err) {
      setMsg('Gagal seed: ' + err.message);
    }
    setSeeding(false);
    setTimeout(() => setMsg(''), 4000);
  };

  if (loading) {
    return <div style={{ padding: '20px', color: '#888' }}>Memuat data modul...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '4px' }}>⚙️ Kelola Modul Edukasi</h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Tambah, edit, atau hapus modul pembelajaran</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
            to="/admin/modules/tambah"
            style={{
              padding: '10px 20px', borderRadius: '10px', background: '#18804e', color: 'white',
              textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
          >
            ＋ Tambah Modul
          </Link>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem' }}>
          {msg}
        </div>
      )}

      {/* Tabel Modul */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8faf9', borderBottom: '2px solid #e5e7eb' }}>
              <th style={thStyle}>No</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Judul Modul</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Deskripsi</th>
              <th style={thStyle}>Sections</th>
              <th style={thStyle}>Video</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {modules.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                  Belum ada modul. Klik "Tambah Modul" atau "Seed ke Firestore" untuk memulai.
                </td>
              </tr>
            ) : (
              modules.map((m, idx) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={tdStyle}>{m.id}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#18312a' }}>{m.title}</td>
                  <td style={{ ...tdStyle, color: '#666', maxWidth: '250px' }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.desc}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                      {m.sections ? m.sections.length : 0}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {m.videoId ? (
                      <span style={{ color: '#e74c3c', fontWeight: 700, fontSize: '1rem' }}>▶</span>
                    ) : (
                      <span style={{ color: '#ccc' }}>—</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Link
                        to={`/admin/modules/edit/${m.id}`}
                        style={{
                          padding: '6px 14px', borderRadius: '8px', background: '#eaf4fe', color: '#0056b3',
                          textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
                        }}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(m.id, m.title)}
                        disabled={deleting === m.id}
                        style={{
                          padding: '6px 14px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626',
                          border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                          opacity: deleting === m.id ? 0.5 : 1,
                        }}
                      >
                        {deleting === m.id ? '...' : '🗑️ Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '16px', color: '#aaa', fontSize: '0.82rem' }}>
        Total: {modules.length} modul
      </div>
    </div>
  );
}

const thStyle = {
  padding: '14px 16px',
  fontSize: '0.82rem',
  fontWeight: 700,
  color: '#666',
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: '0.9rem',
};
