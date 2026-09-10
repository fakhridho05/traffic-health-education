import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTestResults } from '../hooks/useTestResults';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';

export default function AdminTesHasil() {
  const { results: onlineResults, loading: onlineLoading } = useTestResults();
  const [offlineResults, setOfflineResults] = useState([]);
  const [offlineLoading, setOfflineLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [activeSource, setActiveSource] = useState('online');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch offline results
  useEffect(() => {
    const q = query(collection(db, 'offline_test_results'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach(doc => {
        const data = doc.data();
        arr.push({
          id: doc.id,
          ...data,
          dateObj: data.createdAt ? data.createdAt.toDate() : new Date(),
          dateStr: data.createdAt ? data.createdAt.toDate().toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }) : 'Baru saja'
        });
      });
      setOfflineResults(arr);
      setOfflineLoading(false);
    }, () => setOfflineLoading(false));
    return () => unsub();
  }, []);

  const currentResults = activeSource === 'online' ? onlineResults : offlineResults;

  const filteredResults = useMemo(() => {
    let data = currentResults;
    if (filterType !== 'all') {
      data = data.filter(r => r.type === filterType);
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      data = data.filter(r => {
        const d = r.dateObj || (r.createdAt ? r.createdAt.toDate() : new Date());
        return d >= from;
      });
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      data = data.filter(r => {
        const d = r.dateObj || (r.createdAt ? r.createdAt.toDate() : new Date());
        return d <= to;
      });
    }
    return data;
  }, [currentResults, filterType, dateFrom, dateTo]);

  // Helper: flatten answers for Excel row
  const flattenAnswers = (answers) => {
    const cols = {};
    if (!answers) return cols;
    let i = 1;
    Object.entries(answers).forEach(([question, detail]) => {
      if (typeof detail === 'object' && detail !== null) {
        cols[`Soal ${i}`] = question;
        cols[`Jawaban ${i}`] = detail.jawaban || '-';
        cols[`Kunci Jawaban ${i}`] = detail.benar || '-';
        cols[`Status ${i}`] = detail.status || '-';
      } else {
        cols[`Soal ${i}`] = question;
        cols[`Jawaban ${i}`] = String(detail);
      }
      i++;
    });
    return cols;
  };

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Filter by date for Excel too
    const filterByDate = (arr) => {
      let data = arr;
      if (dateFrom) {
        const from = new Date(dateFrom); from.setHours(0,0,0,0);
        data = data.filter(r => {
          const d = r.dateObj || (r.createdAt ? r.createdAt.toDate() : new Date());
          return d >= from;
        });
      }
      if (dateTo) {
        const to = new Date(dateTo); to.setHours(23,59,59,999);
        data = data.filter(r => {
          const d = r.dateObj || (r.createdAt ? r.createdAt.toDate() : new Date());
          return d <= to;
        });
      }
      return data;
    };

    // Sheet 1: Hasil Web (Online) - with full answers
    const filteredOnline = filterByDate(onlineResults);
    const onlineData = filteredOnline.map((r, i) => ({
      'No': i + 1,
      'Waktu Pengerjaan': r.dateStr,
      'Nama Responden': r.userName,
      'ID User': r.userId,
      'Jenis Tes': r.type,
      'Nilai (Skor)': r.score,
      ...flattenAnswers(r.answers)
    }));
    const ws1 = XLSX.utils.json_to_sheet(onlineData.length > 0 ? onlineData : [{ Info: 'Belum ada data' }]);
    XLSX.utils.book_append_sheet(workbook, ws1, "Hasil Web (Online)");

    // Sheet 2: Hasil Seminar (Offline) - with full answers
    const filteredOffline = filterByDate(offlineResults);
    const offlineData = filteredOffline.map((r, i) => ({
      'No': i + 1,
      'Waktu Pengerjaan': r.dateStr,
      'Nama Peserta': r.nama,
      'Status Anak': r.statusAnak || '-',
      'Nama Anak': r.namaAnak || '-',
      'Jenis Tes': r.type,
      'Nilai (Skor)': r.score,
      ...flattenAnswers(r.answers)
    }));
    const ws2 = XLSX.utils.json_to_sheet(offlineData.length > 0 ? offlineData : [{ Info: 'Belum ada data' }]);
    XLSX.utils.book_append_sheet(workbook, ws2, "Hasil Seminar (Offline)");

    const dateLabel = dateFrom || dateTo ? `_${dateFrom || 'awal'}_sd_${dateTo || 'akhir'}` : '';
    XLSX.writeFile(workbook, `Rekap_Hasil_Tes${dateLabel}.xlsx`);
  };

  const loading = onlineLoading || offlineLoading;
  if (loading) return <div style={{ padding: '20px', color: '#888' }}>Memuat data hasil tes...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link to="/admin/quiz" style={{ color: '#555', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginBottom: '8px' }}>
            &lt; Kembali ke Kelola Tes
          </Link>
          <h1 style={{ fontSize: '2rem', color: '#18312a', margin: 0 }}>📊 Hasil Pre-Test & Post-Test</h1>
          <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '4px' }}>Data skor dan jawaban lengkap seluruh pengguna</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none' }}
          >
            <option value="all">-- Semua Tes --</option>
            <option value="Pre-Test">Pre-Test Saja</option>
            <option value="Post-Test">Post-Test Saja</option>
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

      {/* Tab Switch */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '2px solid #e5e7eb' }}>
        <button onClick={() => setActiveSource('online')}
          style={{ padding: '12px 24px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', border: 'none',
            background: activeSource === 'online' ? 'white' : 'transparent',
            color: activeSource === 'online' ? '#18804e' : '#888',
            borderBottom: activeSource === 'online' ? '3px solid #18804e' : '3px solid transparent',
            borderRadius: '8px 8px 0 0', transition: 'all 0.2s' }}>
          🌐 Hasil Web ({onlineResults.length})
        </button>
        <button onClick={() => setActiveSource('offline')}
          style={{ padding: '12px 24px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', border: 'none',
            background: activeSource === 'offline' ? 'white' : 'transparent',
            color: activeSource === 'offline' ? '#9333ea' : '#888',
            borderBottom: activeSource === 'offline' ? '3px solid #9333ea' : '3px solid transparent',
            borderRadius: '8px 8px 0 0', transition: 'all 0.2s' }}>
          🎤 Hasil Seminar ({offlineResults.length})
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
            <thead>
              <tr style={{ background: '#f8faf9', borderBottom: '2px solid #e5e7eb' }}>
                <th style={thStyle}>No.</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>{activeSource === 'online' ? 'Nama Responden' : 'Nama Peserta'}</th>
                {activeSource === 'offline' && <th style={thStyle}>Status Anak</th>}
                <th style={thStyle}>Jenis Tes</th>
                <th style={thStyle}>Nilai</th>
                <th style={thStyle}>Jawaban</th>
                <th style={thStyle}>Waktu Pengerjaan</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={activeSource === 'offline' ? 7 : 6} style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                    Belum ada data hasil tes {activeSource === 'online' ? 'web' : 'seminar'}.
                  </td>
                </tr>
              ) : (
                filteredResults.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ ...tdStyle, textAlign: 'center', color: '#666' }}>{i + 1}</td>
                    <td style={{ ...tdStyle, textAlign: 'left', fontWeight: '600', color: '#18312a' }}>
                      {activeSource === 'online' ? r.userName : r.nama}
                    </td>
                    {activeSource === 'offline' && (
                      <td style={{ ...tdStyle, textAlign: 'center', fontSize: '0.85rem', color: '#555' }}>{r.statusAnak || '-'}</td>
                    )}
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{ 
                        background: r.type === 'Pre-Test' ? '#fef3c7' : '#dcfce7', 
                        color: r.type === 'Pre-Test' ? '#b45309' : '#166534', 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 
                      }}>
                        {r.type}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold', color: r.score >= 70 ? '#166534' : (r.score >= 50 ? '#b45309' : '#dc2626') }}>
                      {r.score}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontSize: '0.8rem', color: '#555' }}>
                      {r.answers ? `${Object.keys(r.answers).length} soal` : '-'}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontSize: '0.85rem', color: '#555' }}>{r.dateStr}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredResults.length > 0 && (
          <div style={{ padding: '16px', borderTop: '1px solid #eee', background: '#fafafa', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>
            Total Data: <strong>{filteredResults.length}</strong> respons. Download Excel untuk melihat detail jawaban per soal.
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = { padding: '14px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#666', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap' };
const tdStyle = { padding: '14px 16px', fontSize: '0.9rem' };
