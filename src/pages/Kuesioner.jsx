import { Link } from 'react-router-dom';
import { useKuesioner } from '../hooks/useKuesioner';

export default function Kuesioner() {
  const { kuesionerList, loading } = useKuesioner();

  if (loading) {
    return <div style={{ padding: '20px', color: '#888' }}>Memuat daftar kuesioner...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '10px', width: '100%' }}>
      <h1 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '5px' }}>Kuesioner</h1>
      <p style={{ color: '#555', marginBottom: '30px', fontSize: '1.05rem' }}>
        Jawablah kuesioner berikut sesuai dengan kondisi Bunda saat ini.
      </p>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Kiri: Daftar Kuesioner */}
        <div style={{ flex: '1 1 60%', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {kuesionerList.map((item) => {
            const numQuestions = item.type === 'form' ? item.fields?.length : item.questions?.length;
            
            return (
              <div key={item.id} style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
              }}
              >
                {/* Icon Placeholder */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: '#f4ecf7',
                  color: '#9b59b6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginRight: '20px',
                  flexShrink: 0
                }}>
                  📝
                </div>

                {/* Text Content */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#222', marginBottom: '4px' }}>{item.title}</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{item.desc}</p>
                </div>

                {/* Right Side: Badge & Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    background: '#f8f9fa',
                    border: '1px solid #ddd',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#555',
                    fontWeight: '500'
                  }}>
                    {numQuestions || 0} Item
                  </div>
                  <Link to={`/kuesioner/${item.id}`} style={{
                    background: '#18804e',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '8px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#12613b'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#18804e'}
                  >
                    Mulai
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kanan: Ilustrasi */}
        <div style={{ flex: '1 1 30%', position: 'sticky', top: '20px' }}>
          <img 
            src="/ibu-anak.png" 
            alt="Ilustrasi Isi Kuesioner" 
            style={{ width: '100%', maxWidth: '350px', height: 'auto', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} 
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      </div>
    </div>
  );
}
