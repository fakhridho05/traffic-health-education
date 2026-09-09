import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate('/lengkapi-profil');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan masuk.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format email tidak valid.');
      } else if (err.code === 'auth/weak-password') {
        setError('Kata sandi terlalu lemah. Minimal 6 karakter.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
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
      setError('Gagal mendaftar dengan Google. Coba lagi.');
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
          <img src="/ibu-anak-5.png" alt="Ibu dan Anak" className="auth-illustration-img" />
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-card animate-fade-in">
          <h1 className="auth-title">Daftar Akun</h1>
          <p className="auth-subtitle">Lengkapi data di bawah untuk bergabung</p>

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
              placeholder="Kata Sandi (min. 6 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="auth-input"
              placeholder="Konfirmasi Kata Sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="auth-btn" style={{ marginTop: '10px' }} disabled={loading}>
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
            
            <div className="auth-divider">atau</div>
            
            <button type="button" className="auth-btn-google" onClick={handleGoogleRegister} disabled={loading}>
              <span style={{fontSize: '1.2rem'}}>G</span> Daftar dengan Google
            </button>
          </form>

          <p className="auth-footer">
            Sudah punya akun? <Link to="/login" className="auth-link" style={{color: '#176c9c'}}>Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
