import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LupaPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        setError('Email tidak ditemukan. Pastikan email yang Bunda masukkan sudah benar.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan. Silakan coba lagi nanti.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-left-content animate-fade-in">
            <div className="auth-left-logo">
              <span style={{ fontSize: '2.6rem', marginRight: '10px' }}>🚦</span>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                <span style={{ fontWeight: '800', fontSize: '1.65rem', color: 'white', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>TRAFFIC HEALTH</span>
                <span style={{ fontWeight: '800', fontSize: '1.65rem', color: 'white', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>EDUCATION</span>
              </div>
            </div>
            <h2 className="auth-left-text">
              Edukasi Kesehatan untuk Cegah Stunting Sejak Dini
            </h2>
          </div>
          <div className="auth-left-illustration animate-fade-in">
            <img src="/ibu-anak-4.png" alt="Ibu dan Anak" className="auth-illustration-img" />
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '15px' }}>📧</div>
            <h1 className="auth-title">Email Terkirim!</h1>
            <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
              Kami telah mengirimkan link untuk mengatur ulang kata sandi ke:<br />
              <strong style={{ color: '#18804e' }}>{email}</strong>
            </p>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '30px', lineHeight: '1.6' }}>
              Silakan cek kotak masuk (inbox) atau folder spam di email Bunda. Klik link di dalam email tersebut untuk membuat kata sandi baru.
            </p>
            <Link to="/login" className="auth-btn" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
              Kembali ke Halaman Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content animate-fade-in">
          <div className="auth-left-logo">
            <span style={{ fontSize: '2.6rem', marginRight: '10px' }}>🚦</span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
              <span style={{ fontWeight: '800', fontSize: '1.65rem', color: 'white', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>TRAFFIC HEALTH</span>
              <span style={{ fontWeight: '800', fontSize: '1.65rem', color: 'white', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>EDUCATION</span>
            </div>
          </div>
          <h2 className="auth-left-text">
            Edukasi Kesehatan untuk Cegah Stunting Sejak Dini
          </h2>
        </div>
        <div className="auth-left-illustration animate-fade-in">
          <img src="/ibu-anak-4.png" alt="Ibu dan Anak" className="auth-illustration-img" />
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card animate-fade-in">
          <h1 className="auth-title">Lupa Kata Sandi?</h1>
          <p className="auth-subtitle">
            Masukkan email yang Bunda gunakan saat mendaftar. Kami akan mengirimkan link untuk mengatur ulang kata sandi.
          </p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              className="auth-input"
              placeholder="Masukkan email Bunda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
            </button>
          </form>

          <p className="auth-footer">
            Sudah ingat kata sandi? <Link to="/login" className="auth-link" style={{color: '#176c9c'}}>Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
