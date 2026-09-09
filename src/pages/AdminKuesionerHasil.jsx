import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useKuesionerResponses } from '../hooks/useKuesionerResponses';
import { useKuesioner } from '../hooks/useKuesioner';
import * as XLSX from 'xlsx';

export default function AdminKuesionerHasil() {
  const { responses, loading: responsesLoading } = useKuesionerResponses();
  const { kuesionerList, loading: kuesionerLoading } = useKuesioner();
  const [selectedKuesioner, setSelectedKuesioner] = useState('all');

  // Filter responses based on selected kuesioner
  const filteredResponses = useMemo(() => {
    if (selectedKuesioner === 'all') return responses;
    return responses.filter(r => r.kuesionerId === selectedKuesioner);
  }, [responses, selectedKuesioner]);

  const handleDownloadExcel = () => {
    if (filteredResponses.length === 0) {
      alert("Tidak ada data untuk diunduh.");
      return;
    }

    // Prepare data for Excel
    const excelData = filteredResponses.map((r, index) => {
      // Base row data
      const row = {
        'No': index + 1,
        'Waktu Pengisian': r.dateStr,
        'Nama Responden': r.userName,
        'ID User': r.userId,
        'Kuesioner': r.kuesionerTitle,
      };

      // Add all answers as columns
      if (r.answers) {
        Object.entries(r.answers).forEach(([key, val]) => {
          // Key might be an index (0, 1, 2) or a string id (nama_ibu). 
          // Make it look slightly better:
          const colName = isNaN(key) ? `Jawaban: ${key}` : `Pertanyaan ${parseInt(key) + 1}`;
          row[colName] = val;
        });
      }

      return row;
    });

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Kuesioner");

    // Generate filename
    const filename = selectedKuesioner === 'all' 
      ? 'Semua_Hasil_Kuesioner.xlsx' 
      : `Hasil_Kuesioner_${selectedKuesioner}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
  };

  if (responsesLoading || kuesionerLoading) {
    return <div style={{ padding: '20px', color: '#888' }}>Memuat data hasil kuesioner...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link to="/admin/kuesioner" style={{ color: '#555', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginBottom: '8px' }}>
            &lt; Kembali ke Kelola Kuesioner
          </Link>
          <h1 style={{ fontSize: '2rem', color: '#18312a', margin: 0 }}>📊 Hasil Kuesioner</h1>
          <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '4px' }}>Data isian kuesioner dari seluruh pengguna</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select 
            value={selectedKuesioner} 
            onChange={(e) => setSelectedKuesioner(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none' }}
          >
            <option value="all">-- Semua Kuesioner --</option>
            {kuesionerList.map(k => (
              <option key={k.id} value={k.id}>{k.title}</option>
            ))}
          </select>

          <button
            onClick={handleDownloadExcel}
            style={{
              padding: '10px 20px', borderRadius: '10px', background: '#18804e', color: 'white', border: 'none',
              fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(24,128,78,0.3)'
            }}
          >
            ⬇️ Download Excel
          </button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f8faf9', borderBottom: '2px solid #e5e7eb' }}>
                <th style={thStyle}>No.</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Nama Responden</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Kuesioner</th>
                <th style={thStyle}>Waktu Pengisian</th>
                <th style={thStyle}>Total Jawaban</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                    Belum ada data kuesioner yang diisi.
                  </td>
                </tr>
              ) : (
                filteredResponses.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ ...tdStyle, textAlign: 'center', color: '#666' }}>{i + 1}</td>
                    <td style={{ ...tdStyle, textAlign: 'left', fontWeight: '600', color: '#18312a' }}>{r.userName}</td>
                    <td style={{ ...tdStyle, textAlign: 'left' }}>
                      <span style={{ background: '#eaf4fe', color: '#0056b3', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {r.kuesionerTitle}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontSize: '0.85rem', color: '#555' }}>{r.dateStr}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold' }}>
                      {r.answers ? Object.keys(r.answers).length : 0} Item
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredResponses.length > 0 && (
          <div style={{ padding: '16px', borderTop: '1px solid #eee', background: '#fafafa', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>
            Total Data: <strong>{filteredResponses.length}</strong> respons. Klik "Download Excel" untuk melihat detail jawaban per pertanyaan.
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = { padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#666', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap' };
const tdStyle = { padding: '14px 16px', fontSize: '0.9rem' };
