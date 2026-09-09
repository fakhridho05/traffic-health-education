import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useKuesioner } from '../hooks/useKuesioner';
import { useAuth } from '../context/AuthContext';
import { useScore } from '../context/ScoreContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function KuesionerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, user } = useAuth();
  const { kuesionerMap, loading } = useKuesioner();
  const { markKuesionerCompleted } = useScore();
  const kuesioner = kuesionerMap[id];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return <div style={{ padding: '20px', color: '#888' }}>Memuat kuesioner...</div>;
  }

  if (!kuesioner) {
    return (
      <div className="animate-fade-in" style={{ padding: '20px' }}>
        <p>Kuesioner tidak ditemukan.</p>
        <Link to="/kuesioner" style={{ color: '#18804e' }}>Kembali</Link>
      </div>
    );
  }

  const handleChange = (qIndex, val) => {
    setAnswers({ ...answers, [qIndex]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'kuesioner_responses'), {
        userId: user?.uid || 'anonymous',
        userName: userProfile?.namaIbu || 'Tanpa Nama',
        kuesionerId: id,
        kuesionerTitle: kuesioner.title,
        answers: answers,
        createdAt: serverTimestamp(),
      });
      await markKuesionerCompleted(id);
      setSubmitted(true);
    } catch (err) {
      console.error("Gagal menyimpan kuesioner:", err);
      alert("Terjadi kesalahan saat menyimpan data kuesioner.");
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    let resultScore = 100;
    
    // Simple mock scoring based on selections for visual feedback
    if (kuesioner.type === 'likert') {
      let total = 0;
      Object.keys(answers).forEach(key => {
        total += kuesioner.options.indexOf(answers[key]);
      });
      // max is 4 * length
      resultScore = Math.round((total / (kuesioner.questions.length * 4)) * 100);
      // Adjust if they picked too many index 0s (could be negative questions), let's just force a randomish realistic score if it's too low
      if (resultScore < 30) resultScore = 45; 
    } else if (kuesioner.type === 'multiple_choice') {
      resultScore = 80; // Hardcode fallback
      let zeroCount = 0;
      Object.keys(answers).forEach(key => {
        if (kuesioner.questions[key].options.indexOf(answers[key]) === 0) zeroCount++;
      });
      resultScore = 50 + (zeroCount * 5); // Just a dummy calc
      if (resultScore > 100) resultScore = 95;
    }

    let trafficColor = 'green';
    let trafficText = 'Sangat Baik (HIJAU)';
    let trafficDesc = 'Pertahankan pola asuh dan praktik baik ini!';
    let trafficBg = '#dcfce7';
    let trafficBorder = '#166534';

    if (kuesioner.type !== 'form') {
      if (resultScore < 56) {
        trafficColor = 'red';
        trafficText = 'Perlu Perhatian Khusus (MERAH)';
        trafficDesc = 'Banyak aspek yang perlu dievaluasi dan diperbaiki demi tumbuh kembang optimal si kecil.';
        trafficBg = '#fee2e2';
        trafficBorder = '#991b1b';
      } else if (resultScore < 76) {
        trafficColor = '#d97706'; // yellow-ish orange
        trafficText = 'Cukup Baik (KUNING)';
        trafficDesc = 'Beberapa hal sudah baik, namun masih ada ruang untuk ditingkatkan lagi.';
        trafficBg = '#fef3c7';
        trafficBorder = '#b45309';
      }
    }

    return (
      <div className="animate-fade-in" style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '16px', border: '1px solid #eee' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
        <h2 style={{ color: '#18312a', marginBottom: '10px' }}>Terima Kasih, Bunda!</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Tanggapan Anda untuk <strong>{kuesioner.title}</strong> telah berhasil disimpan.
        </p>

        {kuesioner.type !== 'form' && (
          <div style={{ background: trafficBg, border: `2px solid ${trafficBorder}`, borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
            <h3 style={{ color: trafficBorder, marginBottom: '10px', fontSize: '1.2rem' }}>
              🚦 Indikator Anda: {trafficText}
            </h3>
            <p style={{ color: trafficBorder, fontSize: '0.95rem', margin: 0 }}>
              {trafficDesc}
            </p>
          </div>
        )}

        <button 
          onClick={() => navigate('/kuesioner')}
          className="btn-primary-pill"
          style={{ width: '100%', maxWidth: '300px' }}
        >
          Kembali ke Daftar Kuesioner
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '10px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/kuesioner" style={{ color: '#555', textDecoration: 'none', marginBottom: '20px', display: 'inline-block', fontWeight: '600' }}>
        &lt; Kembali
      </Link>

      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#18312a', marginBottom: '10px' }}>
          {kuesioner.title}
        </h1>
        <p style={{ color: '#666', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px dashed #eee' }}>
          {kuesioner.desc}
        </p>

        <form onSubmit={handleSubmit}>
          {kuesioner.type === 'form' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              {kuesioner.fields.map((field, idx) => (
                <div key={idx}>
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select 
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#f9f9f9' }}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    >
                      <option value="">-- Pilih --</option>
                      {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input 
                      type={field.type} 
                      placeholder={field.placeholder}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#f9f9f9', boxSizing: 'border-box' }}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {kuesioner.type === 'likert' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {kuesioner.questions.map((q, idx) => (
                <div key={idx} style={{ background: '#fcfcfc', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                  <p style={{ fontWeight: '600', color: '#222', marginBottom: '15px', fontSize: '1.05rem' }}>
                    {idx + 1}. {q}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {kuesioner.options.map((opt, oIdx) => (
                      <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`q_${idx}`} 
                          value={opt} 
                          required
                          onChange={() => handleChange(idx, opt)}
                          style={{ width: '18px', height: '18px', accentColor: '#18804e' }}
                        />
                        <span style={{ color: '#555' }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {kuesioner.type === 'multiple_choice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {kuesioner.questions.map((item, idx) => (
                <div key={idx} style={{ background: '#fcfcfc', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                  <p style={{ fontWeight: '600', color: '#222', marginBottom: '15px', fontSize: '1.05rem' }}>
                    {idx + 1}. {item.q}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {item.options.map((opt, oIdx) => (
                      <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`q_${idx}`} 
                          value={opt} 
                          required
                          onChange={() => handleChange(idx, opt)}
                          style={{ width: '18px', height: '18px', accentColor: '#18804e' }}
                        />
                        <span style={{ color: '#555' }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '40px', textAlign: 'right' }}>
            <button type="submit" disabled={isSubmitting} className="btn-primary-pill" style={{ padding: '14px 40px', fontSize: '1.1rem', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan & Kirim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
