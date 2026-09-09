import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

// ---- Modal Ubah Profil ----
function ModalUbahProfil({ userProfile, onClose, onSave }) {
  const [form, setForm] = useState({
    namaIbu:   userProfile.namaIbu   || '',
    noTelp:    userProfile.noTelp    || '',
    alamat:    userProfile.alamat    || '',
    namaAnak:  userProfile.namaAnak  || '',
    tanggalLahirAnak:   userProfile.tanggalLahirAnak   || '',
    jenisKelaminAnak:   userProfile.jenisKelaminAnak   || '',
    beratLahir:  userProfile.beratLahir  || '',
    tinggiLahir: userProfile.tinggiLahir || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave(form);
      setSuccess('Profil berhasil diperbarui!');
      setTimeout(onClose, 1500);
    } catch (err) {
      setError('Gagal menyimpan. Coba lagi.');
    }
    setLoading(false);
  };

  return (
    <div style={overlay}>
      <div style={modalBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#18312a', fontSize: '1.4rem', margin: 0 }}>✏️ Ubah Profil</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {success && <div style={alertSuccess}>{success}</div>}
        {error   && <div style={alertError}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <p style={sectionLabel}>👤 Data Ibu</p>
          <div style={formGrid}>
            <div style={formGroup}>
              <label style={label}>Nama Lengkap</label>
              <input style={input} name="namaIbu" value={form.namaIbu} onChange={handleChange} required />
            </div>
            <div style={formGroup}>
              <label style={label}>Nomor Telepon</label>
              <input style={input} name="noTelp" value={form.noTelp} onChange={handleChange} />
            </div>
            <div style={{ ...formGroup, gridColumn: '1 / -1' }}>
              <label style={label}>Alamat Domisili</label>
              <textarea style={{ ...input, height: '70px', resize: 'vertical' }} name="alamat" value={form.alamat} onChange={handleChange} />
            </div>
          </div>

          <p style={{ ...sectionLabel, marginTop: '16px' }}>👶 Data Anak</p>
          <div style={formGrid}>
            <div style={formGroup}>
              <label style={label}>Nama Anak</label>
              <input style={input} name="namaAnak" value={form.namaAnak} onChange={handleChange} required />
            </div>
            <div style={formGroup}>
              <label style={label}>Tanggal Lahir Anak</label>
              <input style={input} type="date" name="tanggalLahirAnak" value={form.tanggalLahirAnak} onChange={handleChange} />
            </div>
            <div style={formGroup}>
              <label style={label}>Jenis Kelamin</label>
              <select style={input} name="jenisKelaminAnak" value={form.jenisKelaminAnak} onChange={handleChange}>
                <option value="">-- Pilih --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div style={formGroup}>
              <label style={label}>Berat Lahir (kg)</label>
              <input style={input} type="number" step="0.1" name="beratLahir" value={form.beratLahir} onChange={handleChange} />
            </div>
            <div style={formGroup}>
              <label style={label}>Tinggi Lahir (cm)</label>
              <input style={input} type="number" step="0.1" name="tinggiLahir" value={form.tinggiLahir} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} style={btnSecondary}>Batal</button>
            <button type="submit" style={btnPrimary} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Modal Ganti Password ----
function ModalGantiPassword({ onClose }) {
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasi, setKonfirmasi]   = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (passwordBaru.length < 6) { setError('Password baru minimal 6 karakter.'); return; }
    if (passwordBaru !== konfirmasi) { setError('Konfirmasi password tidak cocok.'); return; }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      const credential  = EmailAuthProvider.credential(currentUser.email, passwordLama);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordBaru);
      setSuccess('Password berhasil diperbarui!');
      setTimeout(onClose, 1800);
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Password lama yang Anda masukkan salah.');
      } else {
        setError('Gagal mengubah password. Coba lagi.');
      }
    }
    setLoading(false);
  };

  return (
    <div style={overlay}>
      <div style={{ ...modalBox, maxWidth: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#18312a', fontSize: '1.4rem', margin: 0 }}>🔒 Ganti Password</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {success && <div style={alertSuccess}>{success}</div>}
        {error   && <div style={alertError}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroup}>
            <label style={label}>Password Lama</label>
            <input style={input} type="password" value={passwordLama} onChange={(e) => setPasswordLama(e.target.value)} required placeholder="Masukkan password saat ini" />
          </div>
          <div style={formGroup}>
            <label style={label}>Password Baru</label>
            <input style={input} type="password" value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)} required placeholder="Minimal 6 karakter" />
          </div>
          <div style={formGroup}>
            <label style={label}>Konfirmasi Password Baru</label>
            <input style={input} type="password" value={konfirmasi} onChange={(e) => setKonfirmasi(e.target.value)} required placeholder="Ulangi password baru" />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} style={btnSecondary}>Batal</button>
            <button type="submit" style={btnPrimary} disabled={loading}>
              {loading ? 'Memproses...' : 'Ganti Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Halaman Profil ----
export default function Profil() {
  const { userProfile, updateProfile } = useAuth();
  const [showUbahProfil, setShowUbahProfil] = useState(false);
  const [showGantiPassword, setShowGantiPassword] = useState(false);

  if (!userProfile) return <div>Memuat profil...</div>;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const calculateAgeMonths = (birthDateString) => {
    if (!birthDateString) return '';
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    return months <= 0 ? 0 : months;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '10px', maxWidth: '850px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '5px' }}>Profil Saya</h1>
      <p style={{ color: '#555', marginBottom: '30px', fontSize: '1.05rem' }}>
        Kelola informasi akun dan data diri Bunda di sini.
      </p>

      {/* Profil Card */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #eaeaea' }}>

        {/* Header Profil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '30px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#eaf2f8', color: '#2980b9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
            👩
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '1.8rem' }}>Bunda {userProfile.namaIbu?.split(' ')[0]}</h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                🌟 Ibu Balita
              </span>
              <span style={{ color: '#888', fontSize: '0.95rem' }}>
                📅 Bergabung sejak: {formatDate(userProfile.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '40px' }}>

          {/* Info Ibu */}
          <div style={{ background: '#fafafa', padding: '25px', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#00287a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>👤</span> Data Diri Ibu
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                { label: 'Nama Lengkap',   value: userProfile.namaIbu },
                { label: 'Email',          value: userProfile.email },
                { label: 'Nomor Telepon',  value: userProfile.noTelp },
                { label: 'Alamat Domisili', value: userProfile.alamat },
              ].map(({ label: l, value: v }) => (
                <div key={l}>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '6px' }}>{l}</div>
                  <div style={{ color: '#333', fontWeight: '600', fontSize: '1.05rem' }}>{v || '-'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Anak */}
          <div style={{ background: '#fafafa', padding: '25px', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#00287a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>👶</span> Data Anak
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '6px' }}>Nama Anak</div>
                <div style={{ color: '#333', fontWeight: '600', fontSize: '1.05rem' }}>{userProfile.namaAnak || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '6px' }}>Tanggal Lahir / Usia</div>
                <div style={{ color: '#333', fontWeight: '600', fontSize: '1.05rem' }}>
                  {formatDate(userProfile.tanggalLahirAnak)} ({calculateAgeMonths(userProfile.tanggalLahirAnak)} Bulan)
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '6px' }}>Jenis Kelamin</div>
                <div style={{ color: '#333', fontWeight: '600', fontSize: '1.05rem' }}>{userProfile.jenisKelaminAnak || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '6px' }}>Berat / Tinggi Lahir</div>
                <div style={{ color: '#333', fontWeight: '600', fontSize: '1.05rem' }}>{userProfile.beratLahir} kg / {userProfile.tinggiLahir} cm</div>
              </div>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowUbahProfil(true)}
            style={{ background: '#18804e', color: 'white', border: 'none', padding: '14px 30px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', flex: 1, fontSize: '1rem', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#12613b'}
            onMouseOut={(e) => e.currentTarget.style.background = '#18804e'}
          >
            ✏️ Ubah Profil
          </button>
          <button
            onClick={() => setShowGantiPassword(true)}
            style={{ background: 'white', color: '#555', border: '2px solid #eaeaea', padding: '14px 30px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', flex: 1, fontSize: '1rem', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
          >
            🔒 Ganti Password
          </button>
        </div>

      </div>

      {/* Modals */}
      {showUbahProfil && (
        <ModalUbahProfil
          userProfile={userProfile}
          onClose={() => setShowUbahProfil(false)}
          onSave={updateProfile}
        />
      )}
      {showGantiPassword && (
        <ModalGantiPassword onClose={() => setShowGantiPassword(false)} />
      )}
    </div>
  );
}

// ---- Shared Styles ----
const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999, padding: '20px',
};

const modalBox = {
  background: 'white', borderRadius: '20px', padding: '36px',
  width: '100%', maxWidth: '680px', maxHeight: '90vh',
  overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
};

const closeBtn = {
  background: 'none', border: 'none', fontSize: '1.3rem',
  cursor: 'pointer', color: '#888', lineHeight: 1,
};

const sectionLabel = {
  fontWeight: '700', color: '#18804e', marginBottom: '14px', fontSize: '1rem',
};

const formGrid = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px',
};

const formGroup = { display: 'flex', flexDirection: 'column', gap: '6px' };

const label = { fontSize: '0.85rem', color: '#555', fontWeight: '600' };

const input = {
  padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px',
  fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 0.2s',
};

const btnPrimary = {
  flex: 1, background: '#18804e', color: 'white', border: 'none',
  padding: '13px 20px', borderRadius: '10px', fontWeight: '700',
  cursor: 'pointer', fontSize: '1rem',
};

const btnSecondary = {
  flex: 1, background: 'white', color: '#555', border: '2px solid #eaeaea',
  padding: '13px 20px', borderRadius: '10px', fontWeight: '600',
  cursor: 'pointer', fontSize: '1rem',
};

const alertSuccess = {
  background: '#e8f5e9', color: '#2e7d32', padding: '12px 16px',
  borderRadius: '10px', marginBottom: '16px', fontWeight: '600', fontSize: '0.95rem',
};

const alertError = {
  background: '#ffebee', color: '#c62828', padding: '12px 16px',
  borderRadius: '10px', marginBottom: '16px', fontWeight: '600', fontSize: '0.95rem',
};
