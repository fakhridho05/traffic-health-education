import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useKuesionerResponses } from '../hooks/useKuesionerResponses';
import { useKuesioner } from '../hooks/useKuesioner';
import * as XLSX from 'xlsx';

export default function AdminKuesionerHasil() {
  const { responses, loading: responsesLoading } = useKuesionerResponses();
  const { kuesionerList, loading: kuesionerLoading } = useKuesioner();
  const [selectedKuesioner, setSelectedKuesioner] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter responses
  const filteredResponses = useMemo(() => {
    let data = responses;
    if (selectedKuesioner !== 'all') {
      data = data.filter(r => r.kuesionerId === selectedKuesioner);
    }
    if (dateFrom) {
      const from = new Date(dateFrom); from.setHours(0,0,0,0);
      data = data.filter(r => {
        const d = r.createdAt ? r.createdAt.toDate() : new Date();
        return d >= from;
      });
    }
    if (dateTo) {
      const to = new Date(dateTo); to.setHours(23,59,59,999);
      data = data.filter(r => {
        const d = r.createdAt ? r.createdAt.toDate() : new Date();
        return d <= to;
      });
    }
    return data;
  }, [responses, selectedKuesioner, dateFrom, dateTo]);

  const handleDownloadExcel = () => {
    if (filteredResponses.length === 0) {
      alert("Tidak ada data untuk diunduh.");
      return;
    }

    const workbook = XLSX.utils.book_new();

    // Group by kuesioner type for separate sheets
    const grouped = {};
    filteredResponses.forEach(r => {
      const title = r.kuesionerTitle || 'Lainnya';
      if (!grouped[title]) grouped[title] = [];
      grouped[title].push(r);
    });

    Object.entries(grouped).forEach(([title, items]) => {
      // Find matching kuesioner definition from kuesionerList
      const kDef = kuesionerList.find(k => k.title === title);

      const excelData = items.map((r, index) => {
        const row = {
          'No': index + 1,
          'Waktu Pengisian': r.dateStr,
          'Nama Responden': r.userName,
          'ID User': r.userId,
        };

        // Add all answers with proper question labels
        if (r.answers && kDef) {
          if (kDef.type === 'form' && kDef.fields) {
            kDef.fields.forEach((field) => {
              row[field.label] = r.answers[field.id] || '-';
            });
          } else if (kDef.type === 'likert' && kDef.questions) {
            kDef.questions.forEach((q, qi) => {
              row[`${qi+1}. ${q.substring(0, 80)}`] = r.answers[qi] || r.answers[String(qi)] || '-';
            });
          } else if (kDef.type === 'multiple_choice' && kDef.questions) {
            kDef.questions.forEach((q, qi) => {
              const qText = q.q || q.question || `Pertanyaan ${qi+1}`;
              row[`${qi+1}. ${qText.substring(0, 80)}`] = r.answers[qi] || r.answers[String(qi)] || '-';
            });
          }
        } else if (r.answers) {
          // Fallback: just dump answers as columns
          Object.entries(r.answers).forEach(([key, val]) => {
            const colName = isNaN(key) ? `Jawaban: ${key}` : `Pertanyaan ${parseInt(key) + 1}`;
            row[colName] = val;
          });
        }

        return row;
      });

      // Sanitize sheet name (max 31 chars, no special chars)
      const sheetName = title.substring(0, 31).replace(/[\\\/\?\*\[\]]/g, '');
      const ws = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    });

    const dateLabel = dateFrom || dateTo ? `_${dateFrom || 'awal'}_sd_${dateTo || 'akhir'}` : '';
    const kuesionerLabel = selectedKuesioner === 'all' 
      ? 'Semua_Kuesioner' 
      : (kuesionerList.find(k => k.id === selectedKuesioner)?.title || selectedKuesioner).replace(/\s+/g, '_');
    XLSX.writeFile(workbook, `Rekap_${kuesionerLabel}${dateLabel}.xlsx`);
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
          <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '4px' }}>Data isian kuesioner lengkap dari seluruh pengguna</p>
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
            ⬇️ Download Excel (Lengkap)
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center', background: '#f8faf9', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <span style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>📅 Filter Tanggal:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: '#666' }}>Dari</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: '#666' }}>Sampai</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', outline: 'none' }} />
        </div>
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(''); setDateTo(''); }}
            style={{ padding: '8px 14px', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
          >
            ✕ Reset
          </button>
        )}
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
            Total Data: <strong>{filteredResponses.length}</strong> respons. Download Excel untuk melihat detail jawaban per pertanyaan.
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = { padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#666', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap' };
const tdStyle = { padding: '14px 16px', fontSize: '0.9rem' };
