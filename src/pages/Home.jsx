import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useScore } from '../context/ScoreContext';
import { useModules } from '../hooks/useModules';

const TOPIC_CARDS = [
  { emoji: '👨‍👩‍👧', title: 'Pola Asuh Positif',          moduleIds: ['03', '04'],       to: '/edukasi' },
  { emoji: '🧩',     title: 'Stimulasi & Tumbuh Kembang', moduleIds: ['05', '06'],       to: '/edukasi' },
  { emoji: '🍲',     title: 'Pemberian Makan',             moduleIds: ['08', '09'],       to: '/edukasi' },
  { emoji: '🧼',     title: 'Hygiene & Sanitasi',          moduleIds: ['07'],             to: '/edukasi' },
  { emoji: '🍎',     title: 'Gizi & Status Gizi',          moduleIds: ['01', '02', '10'], to: '/edukasi' },
];

function getProgressColor(pct) {
  if (pct >= 75) return '#2ecc71';
  if (pct >= 40) return '#ffc107';
  if (pct > 0)   return '#ff4b4b';
  return '#d1d5db';
}

function getStatusLabel(pct) {
  if (pct === 0)   return { text: 'Belum dimulai', color: '#aaa' };
  if (pct < 75)    return { text: 'Sedang dipelajari', color: '#f59e0b' };
  if (pct === 100) return { text: '✅ Selesai', color: '#2ecc71' };
  return { text: 'Hampir selesai', color: '#2ecc71' };
}

function TopicCard({ card, completedModules }) {
  const total = card.moduleIds.length;
  const done  = card.moduleIds.filter((id) => completedModules.includes(id)).length;
  const progress       = total > 0 ? Math.round((done / total) * 100) : 0;
  const color          = getProgressColor(progress);
  const status         = getStatusLabel(progress);

  return (
    <Link to={card.to} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          background: 'white',
          border: `1.5px solid ${progress > 0 ? color + '55' : '#eee'}`,
          borderRadius: '14px',
          padding: '18px 16px 14px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: '2.6rem', marginBottom: '8px', lineHeight: 1 }}>{card.emoji}</div>

        {/* Info Text */}
        <h3 style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#18312a', textAlign: 'center', lineHeight: 1.3, flex: 1 }}>
          {card.title}
        </h3>

        {/* Progress Bar Mini */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 600 }}>
            <span style={{ color: status.color }}>{status.text}</span>
            <span style={{ color: '#555' }}>{done}/{total}</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: '#f0f0f0',
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: color,
              borderRadius: '6px',
              transition: 'width 0.9s ease',
            }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { userProfile } = useAuth();
  const { completedModules, postTestScore, loadingProgress } = useScore();
  const { modules: firestoreModules, loading: modulesLoading } = useModules();
  
  const displayName = userProfile?.namaIbu ? userProfile.namaIbu.split(' ')[0] : 'Bunda';

  const TOTAL_MODULES = firestoreModules.length || 10;
  const totalDone  = completedModules.length;
  const overallPct = TOTAL_MODULES > 0 ? Math.round((totalDone / TOTAL_MODULES) * 100) : 0;

  return (
    <div className="dashboard-home animate-fade-in">

      {/* ── Banner Card ── */}
      <div style={{
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '20px',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        border: '1px solid rgba(255,255,255,0.4)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        overflow: 'hidden',
        minHeight: '240px',
      }}>
        {/* Left content */}
        <div style={{ flex: '1 1 55%', minWidth: '240px', padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
          <h1 style={{ fontSize: '1.85rem', color: '#18312a', marginBottom: '8px', lineHeight: 1.25 }}>
            Halo, Bunda {displayName}! 👋
          </h1>
          <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '28px', maxWidth: '420px' }}>
            Mari belajar bersama untuk membangun keluarga sehat dan cegah stunting sejak dini.
          </p>

          {/* Overall progress + button below */}
          {!loadingProgress && (
            <div style={{ maxWidth: '400px' }}>
              {/* Progress bar block */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#18804e', fontWeight: 700 }}>
                    Progress Belajar
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#18804e', fontWeight: 700 }}>
                    {overallPct}%
                  </span>
                </div>
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${overallPct}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #18804e, #2ecc71)',
                    borderRadius: '6px',
                    transition: 'width 1s ease',
                  }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4px' }}>
                  {totalDone} dari {TOTAL_MODULES} modul selesai
                </div>
              </div>

              {/* Mulai Belajar button below progress */}
              <Link
                to="/edukasi"
                className="auth-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: 'auto',
                  padding: '11px 26px',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                }}
              >
                Mulai Belajar →
              </Link>
            </div>
          )}
        </div>

        {/* Illustration */}
        <div style={{
          flex: '1 1 35%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          paddingTop: '10px',
          paddingRight: '16px',
        }}>
          <img
            src="/ibu-anak-3.png"
            alt="Ilustrasi Ibu dan Anak"
            style={{ maxHeight: '250px', objectFit: 'contain', display: 'block' }}
          />
        </div>
      </div>

      {/* ── Topik Edukasi Card ── */}
      <div style={{
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '20px',
        padding: '22px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        border: '1px solid rgba(255,255,255,0.4)',
        backdropFilter: 'blur(5px)',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{
            fontSize: '1.1rem',
            color: 'white',
            fontWeight: 700,
            textShadow: '-1px -1px 0 #0b5d45, 1px -1px 0 #0b5d45, -1px 1px 0 #0b5d45, 1px 1px 0 #0b5d45',
          }}>
            Topik Edukasi
          </h2>
          <Link to="/edukasi" style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            textShadow: '-1px -1px 0 #0b5d45, 1px -1px 0 #0b5d45, -1px 1px 0 #0b5d45, 1px 1px 0 #0b5d45',
          }}>
            Lihat semua
          </Link>
        </div>

        {/* Cards grid */}
        {loadingProgress ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#666', fontSize: '0.9rem' }}>
            Memuat progress...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
          }}>
            {TOPIC_CARDS.map((card) => (
              <TopicCard
                key={card.title}
                card={card}
                completedModules={completedModules}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
