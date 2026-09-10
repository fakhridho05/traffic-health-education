import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LengkapiProfil() {
  const { user, saveProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    namaIbu: '',
    noTelp: '',
    alamat: '',
    statusAnak: 'punya', // punya | belum | berencana
    namaAnak: '',
    tanggalLahirAnak: '',
    jenisKelaminAnak: '',
    beratLahir: '',
    tinggiLahir: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveProfile(form);
      navigate('/beranda');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Terjadi kesalahan saat menyimpan profil. Coba lagi.');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #fff8e1 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{ 
        background: 'white', borderRadius: '24px', padding: '40px', 
        maxWidth: '550px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
            {step === 1 ? '👩' : '👶'}
          </div>
          <h1 style={{ color: '#18312a', fontSize: '1.8rem', margin: '0 0 8px 0' }}>
            {step === 1 ? 'Data Diri Bunda' : 'Data Si Kecil'}
          </h1>
          <p style={{ color: '#888', margin: 0, fontSize: '0.95rem' }}>
            {step === 1 
              ? 'Lengkapi informasi Bunda untuk personalisasi aplikasi' 
              : 'Ceritakan tentang si kecil untuk rekomendasi yang tepat'
            }
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
          <div style={{ 
            width: '120px', height: '6px', borderRadius: '3px', 
            background: '#18804e', transition: 'background 0.3s'
          }} />
          <div style={{ 
            width: '120px', height: '6px', borderRadius: '3px', 
            background: step === 2 ? '#18804e' : '#e0e0e0', transition: 'background 0.3s'
          }} />
        </div>

        {/* Step 1: Data Ibu */}
        {step === 1 && (
          <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#555', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
                Nama Lengkap
              </label>
              <input 
                type="text" name="namaIbu" value={form.namaIbu} onChange={handleChange}
                placeholder="Masukkan nama lengkap Bunda"
                required
                style={{ 
                  width: '100%', padding: '14px 16px', borderRadius: '12px', 
                  border: '2px solid #e0e0e0', fontSize: '1rem', outline: 'none',
                  transition: 'border 0.3s', boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#18804e'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#555', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
                Nomor Telepon
              </label>
              <input 
                type="tel" name="noTelp" value={form.noTelp} onChange={handleChange}
                placeholder="Contoh: 0812-3456-7890"
                required
                style={{ 
                  width: '100%', padding: '14px 16px', borderRadius: '12px', 
                  border: '2px solid #e0e0e0', fontSize: '1rem', outline: 'none',
                  transition: 'border 0.3s', boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#18804e'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#555', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
                Alamat Domisili
              </label>
              <input 
                type="text" name="alamat" value={form.alamat} onChange={handleChange}
                placeholder="Kecamatan, Kota/Kabupaten"
                required
                style={{ 
                  width: '100%', padding: '14px 16px', borderRadius: '12px', 
                  border: '2px solid #e0e0e0', fontSize: '1rem', outline: 'none',
                  transition: 'border 0.3s', boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#18804e'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <button type="submit" style={{ 
              background: '#18804e', color: 'white', border: 'none', padding: '16px', 
              borderRadius: '12px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer',
              marginTop: '10px', transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#12613b'}
            onMouseOut={(e) => e.currentTarget.style.background = '#18804e'}
            >
              Lanjut ke Data Anak →
            </button>
          </form>
        )}

        {/* Step 2: Data Anak */}
        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#555', fontWeight: '600', marginBottom: '10px', fontSize: '0.9rem' }}>
                Status Anak
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { value: 'punya', label: '👶 Sudah memiliki anak' },
                  { value: 'belum', label: '🙅‍♀️ Belum memiliki anak' },
                  { value: 'berencana', label: '🤰 Berencana memiliki anak' },
                ].map(opt => (
                  <label key={opt.value} style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', 
                    padding: '12px 14px', borderRadius: '12px',
                    background: form.statusAnak === opt.value ? '#f0fdf4' : '#f9f9f9', 
                    border: form.statusAnak === opt.value ? '2px solid #18804e' : '2px solid #e0e0e0', 
                    transition: 'all 0.2s' 
                  }}>
                    <input
                      type="radio"
                      name="statusAnak"
                      value={opt.value}
                      checked={form.statusAnak === opt.value}
                      onChange={handleChange}
                      style={{ accentColor: '#18804e', width: '18px', height: '18px' }}
                    />
                    <span style={{ color: '#333', fontWeight: form.statusAnak === opt.value ? '600' : '400' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Child data fields - only show when statusAnak === 'punya' */}
            {form.statusAnak === 'punya' && (
              <>
                <div>
                  <label style={{ display: 'block', color: '#555', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Nama Lengkap Anak
                  </label>
                  <input 
                    type="text" name="namaAnak" value={form.namaAnak} onChange={handleChange}
                    placeholder="Masukkan nama lengkap anak"
                    required
                    style={{ 
                      width: '100%', padding: '14px 16px', borderRadius: '12px', 
                      border: '2px solid #e0e0e0', fontSize: '1rem', outline: 'none',
                      transition: 'border 0.3s', boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#18804e'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#555', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Tanggal Lahir Anak
                  </label>
                  <input 
                    type="date" name="tanggalLahirAnak" value={form.tanggalLahirAnak} onChange={handleChange}
                    required
                    style={{ 
                      width: '100%', padding: '14px 16px', borderRadius: '12px', 
                      border: '2px solid #e0e0e0', fontSize: '1rem', outline: 'none',
                      transition: 'border 0.3s', boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#18804e'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#555', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Jenis Kelamin Anak
                  </label>
                  <select 
                    name="jenisKelaminAnak" value={form.jenisKelaminAnak} onChange={handleChange}
                    required
                    style={{ 
                      width: '100%', padding: '14px 16px', borderRadius: '12px', 
                      border: '2px solid #e0e0e0', fontSize: '1rem', outline: 'none',
                      transition: 'border 0.3s', boxSizing: 'border-box', background: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#18804e'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: '#555', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Berat Lahir (kg)
                    </label>
                    <input 
                      type="number" step="0.1" name="beratLahir" value={form.beratLahir} onChange={handleChange}
                      placeholder="Contoh: 3.2"
                      required
                      style={{ 
                        width: '100%', padding: '14px 16px', borderRadius: '12px', 
                        border: '2px solid #e0e0e0', fontSize: '1rem', outline: 'none',
                        transition: 'border 0.3s', boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#18804e'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: '#555', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Tinggi Lahir (cm)
                    </label>
                    <input 
                      type="number" step="0.1" name="tinggiLahir" value={form.tinggiLahir} onChange={handleChange}
                      placeholder="Contoh: 50"
                      required
                      style={{ 
                        width: '100%', padding: '14px 16px', borderRadius: '12px', 
                        border: '2px solid #e0e0e0', fontSize: '1rem', outline: 'none',
                        transition: 'border 0.3s', boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#18804e'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Info text for non-punya */}
            {form.statusAnak !== 'punya' && (
              <div style={{ 
                background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', 
                padding: '16px', textAlign: 'center' 
              }}>
                <p style={{ color: '#166534', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {form.statusAnak === 'belum' 
                    ? '✅ Tidak masalah, Bunda! Materi edukasi ini tetap bermanfaat sebagai persiapan di masa depan.'
                    : '✅ Selamat atas rencana Bunda! Materi edukasi ini akan sangat berguna untuk persiapan menyambut si kecil.'
                  }
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button type="button" onClick={() => setStep(1)} style={{ 
                flex: 1, background: 'white', color: '#555', border: '2px solid #e0e0e0', 
                padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
              }}>
                ← Kembali
              </button>
              <button type="submit" disabled={loading} style={{ 
                flex: 2, background: loading ? '#aaa' : '#18804e', color: 'white', border: 'none', 
                padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.05rem', 
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.background = '#12613b')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.background = '#18804e')}
              >
                {loading ? 'Menyimpan...' : '✅ Simpan & Mulai Belajar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
