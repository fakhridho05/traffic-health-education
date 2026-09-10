import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPanduan() {
  return (
    <div className="animate-fade-in" style={{ padding: '10px' }}>
      <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '10px' }}>Panduan Admin</h1>
      <p style={{ color: '#555', marginBottom: '30px', fontSize: '1.05rem', lineHeight: '1.6' }}>
        Selamat datang di halaman Panduan Admin. Sebagai admin, Bunda memiliki akses khusus untuk mengelola konten edukasi, kuesioner, dan melihat hasil evaluasi peserta. Berikut panduan lengkapnya.
      </p>

      <div style={{ display: 'grid', gap: '20px' }}>
        
        {/* Hak Akses Section */}
        <section style={sectionStyle}>
          <h2 style={titleStyle}>🛡️ Hak Akses Admin</h2>
          <ul style={listStyle}>
            <li><strong>Mengelola Modul Edukasi:</strong> Menambah, mengedit, atau menghapus materi, video, tips, infografis, dan pertanyaan evaluasi.</li>
            <li><strong>Mengelola Kuesioner:</strong> Menyesuaikan pertanyaan Pre-Test, Post-Test, EPAQ, PSDQ, dan Praktik.</li>
            <li><strong>Melihat & Mengunduh Hasil Tes:</strong> Mengakses nilai evaluasi seluruh peserta dan mengunduhnya dalam format Excel.</li>
            <li><strong>Menjadikan Pengguna Lain Sebagai Admin:</strong> Secara manual melalui Firebase Console (dengan mengubah `role` menjadi `admin`).</li>
          </ul>
        </section>

        {/* Panduan Kelola Modul */}
        <section style={sectionStyle}>
          <h2 style={titleStyle}>📚 Panduan Mengelola Modul Edukasi</h2>
          <ol style={listStyle}>
            <li>Buka menu <strong>Kelola Modul</strong> dari *sidebar* kiri.</li>
            <li>Untuk mengubah konten awal (bawaan), Bunda bisa menekan tombol hijau <strong>"Seed ke Firestore"</strong>. <em>(Catatan: Ini akan menimpa data modul yang sudah ada)</em>.</li>
            <li>Untuk <strong>menambah modul baru</strong>, klik tombol <strong>"Tambah Modul Baru"</strong>. Isi judul, deskripsi, materi teks, link YouTube untuk video, dll.</li>
            <li>Untuk <strong>mengedit modul</strong>, klik ikon pensil (✏️) pada modul yang ingin diubah. Setelah selesai mengubah materi, klik <strong>Simpan Perubahan</strong>.</li>
            <li>Untuk <strong>menghapus modul</strong>, klik ikon tempat sampah (🗑️). Data tidak bisa dikembalikan setelah dihapus.</li>
          </ol>
        </section>

        {/* Panduan Kelola Kuesioner */}
        <section style={sectionStyle}>
          <h2 style={titleStyle}>📝 Panduan Mengelola Kuesioner</h2>
          <ol style={listStyle}>
            <li>Buka menu <strong>Kelola Kuesioner</strong>.</li>
            <li>Sama seperti modul, tekan <strong>"Seed ke Firestore"</strong> untuk memuat data kuesioner standar.</li>
            <li>Klik ikon ✏️ untuk mengubah daftar pertanyaan pada Kuesioner EPAQ, PSDQ, Praktik, atau Data Diri.</li>
            <li>Pastikan setiap pilihan jawaban sesuai dengan konteks kuesioner (misal: skala Likert dari "Sangat Tidak Setuju" hingga "Sangat Setuju").</li>
          </ol>
        </section>

        {/* Panduan Kelola Tes */}
        <section style={sectionStyle}>
          <h2 style={titleStyle}>🎓 Panduan Mengelola Tes (Pre-Test & Post-Test)</h2>
          <ol style={listStyle}>
            <li>Buka menu <strong>Kelola Tes</strong>.</li>
            <li>Tekan <strong>"Seed ke Firestore"</strong> untuk memuat soal-soal standar Pre/Post Test.</li>
            <li>Klik tombol Edit (✏️) untuk mengubah soal pilihan ganda, mengubah opsi jawaban, dan menentukan kunci jawaban yang benar.</li>
          </ol>
        </section>

        {/* Panduan Hasil Tes */}
        <section style={sectionStyle}>
          <h2 style={titleStyle}>📊 Panduan Mengunduh Hasil Tes</h2>
          <ol style={listStyle}>
            <li>Di menu <strong>Kelola Tes</strong>, klik tombol abu-abu <strong>"Lihat Hasil Tes"</strong> di bagian atas.</li>
            <li>Bunda akan melihat dua tab: <strong>Hasil Web</strong> (dari pengguna yang login) dan <strong>Hasil Seminar</strong> (dari pengguna offline).</li>
            <li>Bunda bisa mem-filter tampilan untuk hanya melihat "Pre-Test" atau "Post-Test".</li>
            <li>Klik tombol hijau <strong>"⬇️ Download Excel (2 Sheet)"</strong>. Komputer Bunda akan mengunduh file `.xlsx` yang bisa dibuka di Microsoft Excel.</li>
          </ol>
        </section>
        
      </div>
    </div>
  );
}

const sectionStyle = {
  background: 'white',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid #eee',
  boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
};

const titleStyle = {
  fontSize: '1.3rem',
  color: '#18312a',
  marginBottom: '15px',
  borderBottom: '2px solid #f0f0f0',
  paddingBottom: '10px'
};

const listStyle = {
  color: '#444',
  lineHeight: '1.8',
  margin: 0,
  paddingLeft: '20px',
  fontSize: '0.95rem'
};
