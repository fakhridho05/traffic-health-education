import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { profile } = await login(email, password);
      if (profile && profile.profileCompleted) {
        navigate('/beranda');
      } else {
        navigate('/lengkapi-profil');
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Email atau kata sandi salah.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Kata sandi salah.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan. Coba lagi nanti.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { profile } = await loginWithGoogle();
      if (profile && profile.profileCompleted) {
        navigate('/beranda');
      } else {
        navigate('/lengkapi-profil');
      }
    } catch (err) {
      setError('Gagal masuk dengan Google. Coba lagi.');
    }
    setLoading(false);
  };

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
          <h1 className="auth-title">Selamat Datang!</h1>
          <p className="auth-subtitle">Silakan masuk untuk melanjutkan</p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              className="auth-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="auth-input"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <div className="auth-forgot">
              <Link to="/lupa-password" className="auth-link" style={{fontWeight: 'normal', fontSize: '0.9rem', color: '#176c9c'}}>Lupa kata sandi?</Link>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
            
            <div className="auth-divider">atau</div>
            
            <button type="button" className="auth-btn-google" onClick={handleGoogleLogin} disabled={loading}>
              <span style={{fontSize: '1.2rem'}}>G</span> Masuk dengan Google
            </button>
          </form>

          <p className="auth-footer">
            Belum punya akun? <Link to="/register" className="auth-link" style={{color: '#176c9c'}}>Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
