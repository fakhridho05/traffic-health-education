import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', textAlign: 'center',
      padding: '20px', background: '#f8faf9'
    }}>
      <h1 style={{ fontSize: '6rem', margin: '0', color: '#18312a' }}>404</h1>
      <h2 style={{ fontSize: '2rem', color: '#18804e', marginTop: '10px' }}>Halaman Tidak Ditemukan</h2>
      <p style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>
        Maaf, halaman yang Anda cari mungkin telah dihapus, diganti namanya, atau sementara tidak tersedia.
      </p>
      <Link to="/beranda" style={{
        background: '#18804e', color: 'white', padding: '12px 30px', borderRadius: '12px',
        textDecoration: 'none', fontWeight: '600', fontSize: '1.1rem'
      }}>
        Kembali ke Beranda
      </Link>
    </div>
  );
}
