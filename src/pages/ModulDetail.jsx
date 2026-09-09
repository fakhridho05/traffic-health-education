import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useModules } from '../hooks/useModules';
import { useScore } from '../context/ScoreContext';

export default function ModulDetail() {
  const { id } = useParams();
  const { modulesMap, loading: modulesLoading } = useModules();
  const modul = modulesMap[id];
  const [activeTab, setActiveTab] = useState('Materi');
  const { markModuleCompleted, markTabOpened, openedTabs, loadingProgress, preTestScore, completedKuesioner } = useScore();

  useEffect(() => {
    if (modul) {
      markModuleCompleted(modul.id);
    }
  }, [modul, markModuleCompleted]);

  useEffect(() => {
    if (modul && activeTab) {
      markTabOpened(modul.id, activeTab);
    }
  }, [modul, activeTab, markTabOpened]);

  if (modulesLoading || loadingProgress) {
    return <div style={{ padding: '20px', color: '#888' }}>Memuat modul...</div>;
  }

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

  if (!modul) {
    return (
      <div className="animate-fade-in" style={{ padding: '20px' }}>
        <p>Modul tidak ditemukan.</p>
        <Link to="/edukasi" style={{ color: '#18804e' }}>Kembali ke Edukasi</Link>
      </div>
    );
  }

  const tabs = ['Materi', 'Video', 'Infografis', 'Tips', 'Evaluasi'];

  const renderSection = (section, idx) => {
    switch (section.type) {
      case 'image':
        return (
          <div key={idx} style={{ marginBottom: '25px', borderRadius: '12px', overflow: 'hidden' }}>
            <img src={section.url} alt={section.alt} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
          </div>
        );
      case 'heading':
        return <h3 key={idx} style={{ color: '#18804e', fontSize: '1.2rem', marginTop: '30px', marginBottom: '15px' }}>{section.text}</h3>;
      case 'paragraph':
        return <p key={idx} style={{ color: '#444', lineHeight: '1.8', marginBottom: '20px' }}>{section.text}</p>;
      case 'callout':
        return (
          <div key={idx} style={{ background: '#f5f9ff', borderLeft: '4px solid #3498db', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
            <strong style={{ display: 'block', color: '#2c3e50', marginBottom: '8px' }}>{section.title}</strong>
            <span style={{ color: '#444', lineHeight: '1.6' }}>{section.text}</span>
          </div>
        );
      case 'checklist':
        return (
          <ul key={idx} style={{ paddingLeft: '25px', marginBottom: '25px' }}>
            {section.items.map((item, i) => (
              <li key={i} style={{ color: '#444', lineHeight: '1.8', marginBottom: '10px' }}>{item}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '10px' }}>
      <Link to="/edukasi" style={{ color: '#555', textDecoration: 'none', marginBottom: '20px', display: 'inline-block', fontWeight: '600' }}>
        &lt; Kembali
      </Link>

      <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '5px' }}>
        {modul.id}. {modul.title}
      </h1>
      <p style={{ color: '#555', marginBottom: '30px', fontSize: '1.1rem' }}>
        {modul.desc}
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '30px', gap: '30px' }}>
        {tabs.map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              paddingBottom: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              color: activeTab === tab ? '#18804e' : '#888',
              borderBottom: activeTab === tab ? '3px solid #18804e' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Content Layout */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Main Text Content */}
        <div style={{ flex: 1, background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #eee' }}>
          {activeTab === 'Materi' && (
            <div>
              <h2 style={{ color: '#18312a', marginBottom: '25px', fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>{modul.title}</h2>
              {modul.sections.map((section, idx) => renderSection(section, idx))}
            </div>
          )}
          
          {activeTab === 'Video' && (
            <div>
              <h2 style={{ color: '#18312a', marginBottom: '20px', fontSize: '1.4rem' }}>Video Edukasi: {modul.title}</h2>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <iframe 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src={`https://www.youtube.com/embed/${modul.videoId}`}
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
              <p style={{ marginTop: '20px', color: '#555', lineHeight: '1.6' }}>
                Simak penjelasan visual mengenai pentingnya pencegahan stunting dan nutrisi bagi anak. Video ini akan memberikan gambaran lebih jelas terkait {modul.title.toLowerCase()}.
              </p>
            </div>
          )}

          {activeTab === 'Tips' && (
            <div>
              <h2 style={{ color: '#18312a', marginBottom: '20px', fontSize: '1.4rem' }}>💡 Tips Praktis: {modul.title}</h2>
              <div style={{ background: '#f8fff9', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #2ecc71' }}>
                {modul.tips.split('\n').map((tip, idx) => (
                  <p key={idx} style={{ color: '#444', lineHeight: '1.8', marginBottom: '10px' }}>
                    {tip}
                  </p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Evaluasi' && (
            <div>
              <h2 style={{ color: '#18312a', marginBottom: '20px', fontSize: '1.4rem' }}>📝 Evaluasi Mandiri</h2>
              <div style={{ background: '#fffcf0', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f39c12' }}>
                {modul.evaluasi.split('\n').map((line, idx) => (
                  <p key={idx} style={{ color: '#444', lineHeight: '1.8', marginBottom: '10px', fontWeight: line.includes('(Kunci:') ? 'bold' : 'normal' }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Infografis' && (
            <div>
              <h2 style={{ color: '#18312a', marginBottom: '20px', fontSize: '1.4rem' }}>📌 Ringkasan Penting (Takeaways)</h2>
              {modul.infografis ? (
                <div style={{ background: '#f5f9ff', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #3498db' }}>
                  {modul.infografis.split('\n').map((line, idx) => (
                    <p key={idx} style={{ color: '#444', lineHeight: '1.8', marginBottom: '10px' }}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                  <p>Konten infografis untuk materi ini sedang dalam tahap penyusunan. Tetap semangat belajar, Bunda!</p>
                </div>
              )}
            </div>
          )}

          {activeTab !== 'Materi' && activeTab !== 'Video' && activeTab !== 'Tips' && activeTab !== 'Evaluasi' && activeTab !== 'Infografis' && (
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
              <p>Konten untuk bagian <strong>{activeTab}</strong> sedang dalam tahap penyusunan.</p>
            </div>
          )}
        </div>

        {/* Legend Sidebar (Traffic Light) */}
        <div style={{ width: '280px', background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eee' }}>
          <h3 style={{ color: '#18312a', fontSize: '1.1rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            🚦 Lampu Lalu Lintas
          </h3>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '24px', height: '24px', background: '#ff4b4b', borderRadius: '50%', flexShrink: 0 }}></div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#ff4b4b' }}>MERAH</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Perilaku atau kondisi yang perlu segera diperbaiki.</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '24px', height: '24px', background: '#ffc107', borderRadius: '50%', flexShrink: 0 }}></div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#e6a800' }}>KUNING</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Perilaku yang sudah ada namun perlu ditingkatkan.</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ width: '24px', height: '24px', background: '#2ecc71', borderRadius: '50%', flexShrink: 0 }}></div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#11782e' }}>HIJAU</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Perilaku yang sudah baik, pertahankan secara konsisten.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
