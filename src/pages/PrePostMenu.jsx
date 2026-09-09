import { Link } from 'react-router-dom';
import { useScore } from '../context/ScoreContext';

export default function PrePostMenu() {
  const { preTestScore, postTestScore } = useScore();

  return (
    <div className="animate-fade-in" style={{ padding: '10px', width: '100%' }}>
      <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '5px' }}>Pre Test - Post Test</h1>
      <p style={{ color: '#555', marginBottom: '30px', fontSize: '1.05rem' }}>
        Tahapan pengisian sebelum dan sesudah intervensi edukasi.
      </p>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Kolom Kiri: Daftar Tahapan */}
        <div style={{ flex: '1 1 60%', minWidth: '300px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '20px' }}>Tahapan</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            {/* Pre Test Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              border: '1px solid #eaeaea',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              {/* Icon */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#f4ecf7',
                color: '#9b59b6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginRight: '20px',
                flexShrink: 0
              }}>
                📋
              </div>

              {/* Text Content */}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#00287a', marginBottom: '6px' }}>Pre Test</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                  Isi kuesioner sebelum memulai edukasi untuk mengetahui kondisi awal.
                </p>
              </div>

              {/* Right Side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  background: preTestScore !== null ? '#e8f5e9' : '#f5f5f5',
                  color: preTestScore !== null ? '#2e7d32' : '#888',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {preTestScore !== null ? `Selesai (Skor: ${preTestScore})` : 'Belum Dikerjakan'}
                </div>
                
                {preTestScore === null ? (
                  <Link to="/pre-test" className="btn-primary-pill" style={{ padding: '10px 30px' }}>
                    Kerjakan
                  </Link>
                ) : (
                  <button disabled style={{ padding: '10px 30px', borderRadius: '50px', background: '#e0e0e0', color: '#999', border: 'none', fontWeight: 'bold' }}>
                    Selesai
                  </button>
                )}
              </div>
            </div>

            {/* Arrow Divider */}
            <div style={{ textAlign: 'center', fontSize: '1.8rem', color: 'white', textShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
              ▼
            </div>

            {/* Post Test Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              border: '1px solid #eaeaea',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              opacity: preTestScore === null ? 0.6 : 1
            }}>
              {/* Icon */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#eaf2f8',
                color: '#2980b9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginRight: '20px',
                flexShrink: 0
              }}>
                📝
              </div>

              {/* Text Content */}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#00287a', marginBottom: '6px' }}>Post Test</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                  Isi kuesioner setelah menyelesaikan edukasi untuk menilai perubahan.
                </p>
              </div>

              {/* Right Side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  background: postTestScore !== null ? '#e8f5e9' : '#f5f5f5',
                  color: postTestScore !== null ? '#2e7d32' : '#888',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {postTestScore !== null ? `Selesai (Skor: ${postTestScore})` : 'Belum Dikerjakan'}
                </div>
                
                {preTestScore === null ? (
                  <button disabled style={{ padding: '10px 30px', borderRadius: '50px', background: '#f5f5f5', color: '#ccc', border: '1px solid #ddd', fontWeight: 'bold' }}>
                    Kerjakan
                  </button>
                ) : postTestScore === null ? (
                  <Link to="/post-test" className="btn-primary-pill" style={{ padding: '10px 30px' }}>
                    Kerjakan
                  </Link>
                ) : (
                  <button disabled style={{ padding: '10px 30px', borderRadius: '50px', background: '#e0e0e0', color: '#999', border: 'none', fontWeight: 'bold' }}>
                    Selesai
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div style={{
            background: '#eaf4fe',
            border: '1px solid #b6d4f0',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#004085',
            fontSize: '0.95rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🕒</span>
            Pre test harus diselesaikan terlebih dahulu sebelum mengakses materi edukasi.
          </div>
        </div>

        {/* Kolom Kanan: Ilustrasi / Gambar */}
        <div style={{ flex: '1 1 30%', position: 'sticky', top: '20px' }}>
          <div style={{ marginTop: '-40px' }}>
            <img 
              src="/ibu-anak-2.png" 
              alt="Ilustrasi Evaluasi Ibu" 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
