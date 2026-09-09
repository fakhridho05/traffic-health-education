import { Link } from 'react-router-dom';
import { useScore } from '../context/ScoreContext';
import { useModules } from '../hooks/useModules';

const EMOJI_MAP = {
  '01': '👶', '02': '🤰', '03': '👨‍👩‍👧', '04': '👩‍👧', '05': '🧩',
  '06': '🛌', '07': '🧼', '08': '🍲', '09': '🥄', '10': '⚖️',
};

function getProgressColor(pct) {
  if (pct >= 75) return '#2ecc71';
  if (pct >= 40) return '#ffc107';
  if (pct > 0)   return '#ff4b4b';
  return '#d1d5db';
}

function getStatusLabel(pct) {
  if (pct === 0)   return { text: 'Belum dimulai', color: '#aaa' };
  if (pct === 100) return { text: '✅ Selesai',    color: '#2ecc71' };
  if (pct >= 75)   return { text: 'Hampir selesai', color: '#2ecc71' };
  return { text: 'Sedang dipelajari', color: '#f59e0b' };
}

export default function Edukasi() {
  const { openedTabs, loadingProgress, preTestScore, completedKuesioner } = useScore();
  const { modules: firestoreModules, loading: modulesLoading } = useModules();

  if (modulesLoading || loadingProgress) {
    return <div style={{ padding: '20px', color: '#888' }}>Memuat modul...</div>;
  }

  // Lock logic: user must have done pre-test and at least some kuesioner (we'll check if they did all 4)
  const isLocked = preTestScore === null || completedKuesioner.length < 4;

  if (isLocked) {
    return (
      <div className="animate-fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '10px' }}>🔒</div>
        <h2 style={{ color: '#18312a', marginBottom: '15px' }}>Modul Edukasi Terkunci</h2>
        <p style={{ color: '#666', marginBottom: '30px', maxWidth: '400px', lineHeight: '1.6' }}>
          Bunda harus menyelesaikan <strong>Pre-Test</strong> dan seluruh <strong>Kuesioner</strong> terlebih dahulu untuk dapat mengakses dan mempelajari modul-modul ini.
        </p>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/kuesioner" className="btn-primary-pill" style={{ background: '#0284c7' }}>
            Isi Kuesioner
          </Link>
          <Link to="/pre-test" className="btn-primary-pill">
            Mulai Pre-Test
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '10px' }}>
      <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '5px' }}>Edukasi</h1>
      <p style={{ color: '#555', marginBottom: '30px' }}>Pilih materi yang ingin Bunda pelajari</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
        gap: '18px',
      }}>
        {firestoreModules.map((mod) => {
          const emoji = EMOJI_MAP[mod.id] || '📖';
          const modTabs = openedTabs[mod.id] || [];
          const openedCount = modTabs.length;
          const progress = loadingProgress ? 0 : Math.round((openedCount / 5) * 100);
          const isCompleted = progress === 100;
          
          const color           = getProgressColor(progress);
          const status          = getStatusLabel(progress);

          return (
            <Link to={`/edukasi/${mod.id}`} key={mod.id} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <div
                style={{
                  background: '#fff',
                  border: `1.5px solid ${progress > 0 ? color + '55' : '#eee'}`,
                  borderRadius: '16px',
                  padding: '20px 16px 16px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.09)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                }}
              >
                {/* Badge Nomor */}
                <div style={{
                  background: isCompleted ? '#18804e' : '#e9ecef',
                  color: isCompleted ? 'white' : '#888',
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '14px',
                }}>
                  {isCompleted ? '✓' : mod.id}
                </div>

                {/* Emoji */}
                <div style={{ textAlign: 'center', fontSize: '3.2rem', marginBottom: '12px', lineHeight: 1 }}>
                  {emoji}
                </div>

                {/* Judul & Deskripsi */}
                <h3 style={{ fontSize: '1rem', color: '#18312a', marginBottom: '6px', lineHeight: 1.35, fontWeight: 700 }}>
                  {mod.title}
                </h3>
                <p style={{ color: '#666', fontSize: '0.82rem', flex: 1, marginBottom: '16px', lineHeight: 1.5 }}>
                  {mod.desc}
                </p>

                {/* Status label */}
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: status.color, marginBottom: '8px', display: 'block' }}>
                  {status.text}
                </span>

                {/* Progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: color, minWidth: '32px' }}>
                    {progress}%
                  </span>
                  <div style={{ flex: 1, background: '#e9ecef', height: '6px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: color,
                      borderRadius: '6px',
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>

                {/* Dot indicator */}
                {progress > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%', background: color,
                      boxShadow: `0 0 0 3px ${color}30`,
                    }} />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
