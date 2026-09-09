import { Link } from 'react-router-dom';
import { useScore } from '../context/ScoreContext';
import { useModules } from '../hooks/useModules';

const EMOJI_MAP = {
  '01': '👶', '02': '🤰', '03': '👨‍👩‍👧', '04': '👩‍👧', '05': '🧩',
  '06': '🛌', '07': '🧼', '08': '🍲', '09': '🥄', '10': '⚖️',
};

export default function Progress() {
  const { preTestScore, postTestScore, getTrafficLight, completedModules, loadingProgress } = useScore();
  const { modules: firestoreModules, loading: modulesLoading } = useModules();

  if (loadingProgress || modulesLoading) {
    return <div>Memuat progres...</div>;
  }

  const totalModules         = firestoreModules.length;
  const completedModulesCount = completedModules ? completedModules.length : 0;
  const progressPercent      = totalModules > 0 ? Math.round((completedModulesCount / totalModules) * 100) : 0;

  const preLight  = preTestScore  !== null ? getTrafficLight(preTestScore)  : null;
  const postLight = postTestScore !== null ? getTrafficLight(postTestScore) : null;

  return (
    <div className="animate-fade-in" style={{ padding: '10px', width: '100%' }}>
      <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '5px' }}>Progres Belajar</h1>
      <p style={{ color: '#555', marginBottom: '30px', fontSize: '1.05rem' }}>
        Pantau perkembangan pengetahuan dan aktivitas belajar Bunda di sini.
      </p>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── Kolom Kiri ── */}
        <div style={{ flex: '1 1 60%', minWidth: '300px' }}>

          {/* Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>

            {/* Materi Edukasi */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ width: '45px', height: '45px', background: '#eaf2f8', color: '#2980b9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                  📚
                </div>
                <h3 style={{ margin: 0, color: '#333', fontSize: '1.15rem' }}>Materi Edukasi</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#18312a', lineHeight: '1' }}>
                  {completedModulesCount}
                </span>
                <span style={{ fontSize: '1.2rem', color: '#888' }}>/ {totalModules} Modul</span>
              </div>
              <p style={{ color: '#666', margin: '0 0 15px 0', fontSize: '0.9rem' }}>Telah diselesaikan</p>
              <div style={{ width: '100%', height: '10px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: '#18804e', borderRadius: '10px', transition: 'width 1s ease' }} />
              </div>
            </div>

            {/* Evaluasi Skor */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '45px', height: '45px', background: '#fef1e6', color: '#e67e22', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                  📈
                </div>
                <h3 style={{ margin: 0, color: '#333', fontSize: '1.15rem' }}>Evaluasi Skor</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', background: '#fcfcfc', padding: '12px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                <span style={{ color: '#555', fontWeight: '500' }}>Skor Awal (Pre-Test)</span>
                {preTestScore !== null ? (
                  <span style={{ fontWeight: 'bold', color: `var(--color-${preLight.color})`, fontSize: '1.1rem' }}>
                    {preTestScore}
                  </span>
                ) : (
                  <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Belum Dikerjakan</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc', padding: '12px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                <span style={{ color: '#555', fontWeight: '500' }}>Skor Akhir (Post-Test)</span>
                {postTestScore !== null ? (
                  <span style={{ fontWeight: 'bold', color: `var(--color-${postLight.color})`, fontSize: '1.1rem' }}>
                    {postTestScore}
                  </span>
                ) : (
                  <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Belum Dikerjakan</span>
                )}
              </div>
            </div>
          </div>

          {/* Rincian Modul – diurutkan 01–10 */}
          <h3 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '16px' }}>Rincian Modul</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {firestoreModules.map((modul, idx) => {
              const isCompleted = completedModules && completedModules.includes(modul.id);
              const emoji = EMOJI_MAP[modul.id] || '📖';

              return (
                <div
                  key={modul.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'white',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: isCompleted ? '1px solid #c8e6c9' : '1px solid #eaeaea',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {/* Kiri: nomor + info modul */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    {/* Nomor / check */}
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                      background: isCompleted ? '#e8f5e9' : '#f5f5f5',
                      color: isCompleted ? '#2e7d32' : '#aaa',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: isCompleted ? '1.1rem' : '0.9rem',
                    }}>
                      {isCompleted ? '✓' : String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* Emoji + Judul */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1rem' }}>{emoji}</span>
                        <h4 style={{
                          margin: 0, color: '#222', fontSize: '0.95rem',
                          fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {modul.title}
                        </h4>
                      </div>
                      <p style={{ margin: '3px 0 0', color: isCompleted ? '#2e7d32' : '#aaa', fontSize: '0.8rem', fontWeight: 500 }}>
                        {isCompleted ? '✅ Selesai dibaca' : 'Belum dibuka'}
                      </p>
                    </div>
                  </div>

                  {/* Kanan: tombol */}
                  <Link
                    to={`/edukasi/${modul.id}`}
                    style={{
                      flexShrink: 0,
                      padding: '8px 18px',
                      background: isCompleted ? '#f1f8f4' : '#18804e',
                      color: isCompleted ? '#18804e' : 'white',
                      border: isCompleted ? '1.5px solid #18804e' : 'none',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      transition: 'background 0.2s',
                      marginLeft: '12px',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = isCompleted ? '#d9eee3' : '#12613b';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = isCompleted ? '#f1f8f4' : '#18804e';
                    }}
                  >
                    {isCompleted ? 'Baca Ulang' : 'Mulai Belajar'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Kolom Kanan ── */}
        <div style={{ flex: '1 1 30%', position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <img
              src="/ibu-anak-1.png"
              alt="Ilustrasi Ibu dan Anak"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <div style={{ background: '#18804e', color: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(24,128,78,0.2)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: 'white' }}>Terus Semangat, Bunda! 🌟</h3>
            <p style={{ margin: 0, lineHeight: '1.6', opacity: '0.9', fontSize: '0.95rem', color: 'white' }}>
              Konsistensi Bunda dalam mempelajari nutrisi dan pola asuh adalah investasi terbaik untuk masa depan cerdas si kecil. Setiap modul yang diselesaikan membawa Bunda selangkah lebih dekat menuju generasi bebas stunting.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
