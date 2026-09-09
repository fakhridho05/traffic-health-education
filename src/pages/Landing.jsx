import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing-page-wrapper">
      <div className="hero-landing" style={{ flex: 1 }}>
        <div className="hero-content">
          <div className="hero-logo">
            <span style={{ fontSize: '2.5rem', marginRight: '10px' }}>🚦</span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
              <span style={{ fontWeight: '800', fontSize: '1.5rem', letterSpacing: '1px' }}>TRAFFIC HEALTH</span>
              <span style={{ fontWeight: '800', fontSize: '1.5rem', letterSpacing: '1px' }}>EDUCATION</span>
            </div>
          </div>

          <h1 className="hero-title">
            Pencegahan Stunting Berbasis<br/>
            Pendekatan Lampu Lalu Lintas
          </h1>
          
          <p className="hero-subtitle">
            Mari Cegah Stunting Sejak Dini!
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn-primary-pill">
              Mulai Sekarang
            </Link>
            <a 
              href="https://wa.me/6282132230109" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline-pill"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Hubungi Kami
            </a>
          </div>

          {/* Seminar Offline Buttons */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/seminar/pre-test" style={{
              textDecoration: 'none', padding: '10px 22px', borderRadius: '30px',
              background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.5)',
              color: 'white', fontWeight: '600', fontSize: '0.9rem', backdropFilter: 'blur(4px)',
              display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
            }}>
              📝 Pre-Test Seminar
            </Link>
            <Link to="/seminar/post-test" style={{
              textDecoration: 'none', padding: '10px 22px', borderRadius: '30px',
              background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.5)',
              color: 'white', fontWeight: '600', fontSize: '0.9rem', backdropFilter: 'blur(4px)',
              display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
            }}>
              🎓 Post-Test Seminar
            </Link>
          </div>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <span style={{ fontSize: '2rem' }}>🚦</span>
              <div className="footer-logo-title">
                <div>TRAFFIC HEALTH</div>
                <div>EDUCATION</div>
              </div>
            </div>
            <p className="footer-desc">
              Platform edukasi interaktif pencegahan stunting berbasis metode Lampu Lalu Lintas untuk mendukung pola hidup dan gizi keluarga sehat sejak dini.
            </p>
          </div>

          <div>
            <h4 className="footer-section-title">Navigasi</h4>
            <ul className="footer-links">
              <li><Link to="/login">Masuk (Login)</Link></li>
              <li><Link to="/register">Daftar Akun</Link></li>
              <li><Link to="/bantuan">Pusat Bantuan</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-section-title">Hubungi Kami</h4>
            <div className="footer-contact-item">
              <span>📱</span>
              <a 
                href="https://wa.me/6282132230109" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}
              >
                +62 821-3223-0109
              </a>
            </div>
            <div className="footer-contact-item">
              <span>📍</span>
              <span>Indonesia</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Traffic Health Education. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
