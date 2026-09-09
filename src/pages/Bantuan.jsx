import { useState } from 'react';

const FAQ_DATA = [
  {
    q: "Apa itu Aplikasi Traffic Health Education?",
    a: "Aplikasi ini adalah wadah edukasi interaktif berbasis pendekatan lampu lalu lintas untuk membantu Ibu meningkatkan pengetahuan seputar gizi, pola asuh, dan pencegahan stunting pada balita."
  },
  {
    q: "Mengapa saya tidak bisa membuka materi Edukasi?",
    a: "Pastikan Bunda telah menyelesaikan seluruh soal pada menu Pre Test terlebih dahulu. Materi edukasi baru akan terbuka setelah Pre Test selesai dikerjakan."
  },
  {
    q: "Bagaimana cara membaca hasil Evaluasi Skor?",
    a: "Skor akan ditandai dengan warna Lampu Lalu Lintas. Merah (Kurang/Berisiko), Kuning (Cukup/Hati-hati), dan Hijau (Baik/Aman). Tujuannya adalah membantu Bunda memahami area mana yang sudah baik dan mana yang perlu ditingkatkan."
  },
  {
    q: "Apakah data kuesioner saya aman?",
    a: "Tentu. Seluruh data yang Bunda masukkan (seperti data diri, jawaban kuesioner, dan data anak) dijaga kerahasiaannya dan hanya digunakan untuk keperluan evaluasi kesehatan oleh kader/bidan pendamping."
  },
  {
    q: "Bagaimana jika saya lupa kata sandi (password)?",
    a: "Bunda dapat menghubungi kader atau bidan pendamping di wilayah Bunda untuk melakukan proses reset kata sandi, atau menekan tombol 'Lupa Password' pada halaman awal saat akan masuk (login)."
  }
];

export default function Bantuan() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '10px', maxWidth: '850px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '5px' }}>Bantuan & FAQ</h1>
      <p style={{ color: '#555', marginBottom: '30px', fontSize: '1.05rem' }}>
        Temukan jawaban atas pertanyaan umum atau hubungi kami jika butuh bantuan lebih lanjut.
      </p>

      {/* Hubungi Kami Card */}
      <div style={{ 
        background: 'linear-gradient(135deg, #18804e 0%, #12613b 100%)', 
        borderRadius: '20px', padding: '30px', color: 'white', marginBottom: '40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px',
        boxShadow: '0 10px 20px rgba(24,128,78,0.2)'
      }}>
        <div>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: 'white' }}>Butuh Bantuan Langsung?</h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem', maxWidth: '500px', lineHeight: '1.5', color: 'white' }}>
            Jika Bunda memiliki kendala teknis atau pertanyaan seputar kesehatan si kecil, jangan ragu untuk menghubungi Bidan atau Kader pendamping.
          </p>
        </div>
        <a 
          href="https://wa.me/6282132230109"
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
          background: 'white', color: '#18804e', border: 'none', padding: '12px 25px', textDecoration: 'none',
          borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>💬</span> Hubungi via WhatsApp
        </a>
      </div>

      <h3 style={{ fontSize: '1.3rem', color: '#333', marginBottom: '20px' }}>Pertanyaan yang Sering Diajukan</h3>

      {/* FAQ Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {FAQ_DATA.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} style={{ 
              background: 'white', 
              borderRadius: '12px', 
              border: '1px solid #eaeaea', 
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
            }}>
              <button 
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: isOpen ? '#f4fbf7' : 'white', border: 'none', padding: '20px', cursor: 'pointer',
                  textAlign: 'left', fontSize: '1.05rem', fontWeight: '600', color: isOpen ? '#18804e' : '#333',
                  transition: 'background 0.3s ease'
                }}
              >
                {faq.q}
                <span style={{ 
                  fontSize: '1.2rem', color: isOpen ? '#18804e' : '#999',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}>
                  ▼
                </span>
              </button>
              
              {isOpen && (
                <div style={{ 
                  padding: '0 20px 20px 20px', 
                  color: '#555', 
                  lineHeight: '1.7',
                  fontSize: '0.95rem',
                  borderTop: '1px solid #eaeaea',
                  paddingTop: '20px',
                  background: '#f4fbf7'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
    </div>
  );
}
