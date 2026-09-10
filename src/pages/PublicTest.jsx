import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const PASSWORDS = {
  'pre-test': '123',
  'post-test': '456',
};

export default function PublicTest() {
  const { type } = useParams(); // 'pre-test' or 'post-test'
  const isPreTest = type === 'pre-test';
  const label = isPreTest ? 'Pre-Test' : 'Post-Test';
  const correctPassword = PASSWORDS[type] || '000';

  // Steps: 'password' -> 'biodata' -> 'quiz' -> 'result'
  const [step, setStep] = useState('password');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Biodata
  const [nama, setNama] = useState('');
  const [namaAnak, setNamaAnak] = useState('');
  const [statusAnak, setStatusAnak] = useState('punya'); // punya | belum | berencana

  // Quiz
  const { questions: QUESTIONS, loading } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finalScore, setFinalScore] = useState(null);

  // Step 1: Password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setPasswordError('');
      setStep('biodata');
    } else {
      setPasswordError('Password salah. Silakan hubungi panitia seminar.');
    }
  };

  // Step 2: Biodata
  const handleBiodataSubmit = (e) => {
    e.preventDefault();
    setStep('quiz');
  };

  // Step 3: Quiz
  const handleSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizSubmit = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert("Harap jawab semua pertanyaan terlebih dahulu.");
      return;
    }

    let correctCount = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    const percentage = Math.round((correctCount / QUESTIONS.length) * 100);
    setFinalScore(percentage);

    // Build detailed answers data
    const answersData = {};
    QUESTIONS.forEach(q => {
      answersData[q.question] = {
        jawaban: q.options[answers[q.id]],
        benar: q.options[q.correctAnswer],
        status: answers[q.id] === q.correctAnswer ? 'Benar' : 'Salah'
      };
    });

    // Save to Firestore in separate collection
    try {
      await addDoc(collection(db, 'offline_test_results'), {
        nama: nama,
        namaAnak: statusAnak === 'punya' ? namaAnak : null,
        statusAnak: statusAnak === 'punya' ? 'Memiliki Anak' : statusAnak === 'berencana' ? 'Berencana Memiliki Anak' : 'Belum Memiliki Anak',
        type: label,
        score: percentage,
        answers: answersData,
        source: 'seminar_offline',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error saving offline test result:', err);
    }

    setStep('result');
  };

  // Traffic light helper
  const getTrafficLight = (score) => {
    if (score >= 76) return { color: '#166534', bg: '#dcfce7', border: '#166534', text: 'Baik (HIJAU)', label: '🟢', desc: 'Pengetahuan Bunda sudah sangat baik! Pertahankan dan terus terapkan.' };
    if (score >= 56) return { color: '#b45309', bg: '#fef3c7', border: '#b45309', text: 'Cukup (KUNING)', label: '🟡', desc: 'Pengetahuan Bunda cukup baik, namun masih ada beberapa hal yang perlu dipelajari lebih dalam.' };
    return { color: '#991b1b', bg: '#fee2e2', border: '#991b1b', text: 'Perlu Belajar Lagi (MERAH)', label: '🔴', desc: 'Jangan khawatir Bunda! Mari pelajari materi edukasi agar pengetahuan semakin meningkat.' };
  };

  // --- RENDER ---

  // Password Screen
  if (step === 'password') {
    return (
      <div style={pageWrapper}>
        <div style={cardStyle}>
          <Link to="/" style={{ color: '#555', textDecoration: 'none', fontWeight: '600', marginBottom: '20px', display: 'inline-block' }}>&lt; Kembali ke Beranda</Link>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{isPreTest ? '📝' : '🎓'}</div>
            <h1 style={{ fontSize: '1.8rem', color: '#18312a', marginBottom: '8px' }}>
              {label} Seminar Offline
            </h1>
            <p style={{ color: '#666' }}>Masukkan password yang diberikan panitia untuk memulai</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
            {passwordError && <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '8px' }}>{passwordError}</p>}
            <button type="submit" style={btnPrimary}>Lanjutkan</button>
          </form>
        </div>
      </div>
    );
  }

  // Biodata Screen
  if (step === 'biodata') {
    return (
      <div style={pageWrapper}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👩‍👧</div>
            <h2 style={{ fontSize: '1.5rem', color: '#18312a', marginBottom: '8px' }}>Data Peserta Seminar</h2>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>Lengkapi data singkat sebelum memulai {label}</p>
          </div>

          <form onSubmit={handleBiodataSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Nama Lengkap <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                placeholder="Contoh: Siti Aminah"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Status Anak</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                {[
                  { value: 'punya', label: '👶 Sudah memiliki anak' },
                  { value: 'belum', label: '🙅‍♀️ Belum memiliki anak' },
                  { value: 'berencana', label: '🤰 Berencana memiliki anak' },
                ].map(opt => (
                  <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 14px', background: statusAnak === opt.value ? '#f0fdf4' : '#f9f9f9', borderRadius: '10px', border: statusAnak === opt.value ? '2px solid #18804e' : '1px solid #e0e0e0', transition: 'all 0.2s' }}>
                    <input
                      type="radio"
                      name="statusAnak"
                      value={opt.value}
                      checked={statusAnak === opt.value}
                      onChange={(e) => setStatusAnak(e.target.value)}
                      style={{ accentColor: '#18804e', width: '16px', height: '16px' }}
                    />
                    <span style={{ color: '#333', fontWeight: statusAnak === opt.value ? '600' : '400' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {statusAnak === 'punya' && (
              <div>
                <label style={labelStyle}>Nama Anak <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Contoh: Budi"
                  value={namaAnak}
                  onChange={(e) => setNamaAnak(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            )}

            <button type="submit" style={btnPrimary}>Mulai {label}</button>
          </form>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (step === 'quiz') {
    if (loading || !QUESTIONS || QUESTIONS.length === 0) {
      return <div style={pageWrapper}><div style={cardStyle}><p style={{ color: '#888' }}>Memuat soal...</p></div></div>;
    }

    const q = QUESTIONS[currentQuestion];
    return (
      <div style={pageWrapper}>
        <div style={{ ...cardStyle, maxWidth: '650px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#18312a' }}>{label} (Seminar)</h2>
            <div style={{ background: '#f5f9f7', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', color: '#2b8a67', fontWeight: '600' }}>
              {currentQuestion + 1} / {QUESTIONS.length}
            </div>
          </div>
          <p style={{ color: '#555', marginBottom: '25px', fontSize: '0.95rem' }}>Pilihlah satu jawaban yang paling tepat.</p>

          <div style={{ background: '#f8fbf9', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
            <p style={{ fontWeight: '600', marginBottom: '20px', color: '#18312a', fontSize: '1.05rem', lineHeight: '1.5' }}>{q.question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {q.options.map((opt, index) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === index}
                    onChange={() => handleSelect(q.id, index)}
                    style={{ width: '18px', height: '18px', accentColor: '#18804e' }}
                  />
                  <span style={{ color: answers[q.id] === index ? '#18804e' : '#555', fontWeight: answers[q.id] === index ? '600' : '400' }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={handlePrev} disabled={currentQuestion === 0}
              style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #ddd', borderRadius: '8px', cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer', color: currentQuestion === 0 ? '#aaa' : '#333', fontWeight: '600' }}>
              Sebelumnya
            </button>
            <button type="button" onClick={handleNext}
              style={{ padding: '12px 24px', background: '#18804e', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: '600' }}>
              {currentQuestion === QUESTIONS.length - 1 ? 'Kirim' : 'Selanjutnya'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (step === 'result' && finalScore !== null) {
    const light = getTrafficLight(finalScore);
    return (
      <div style={pageWrapper}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>✅</div>
          <h2 style={{ fontSize: '1.8rem', color: '#18312a', marginBottom: '10px' }}>Terima Kasih, {nama}! 🎉</h2>
          <p style={{ color: '#555', marginBottom: '30px' }}>
            {label} telah berhasil diselesaikan dan jawaban Anda telah tersimpan.
          </p>

          <div style={{ background: light.bg, border: `2px solid ${light.border}`, borderRadius: '14px', padding: '24px', marginBottom: '30px', display: 'inline-block', minWidth: '280px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{light.label}</div>
            <h3 style={{ margin: '0 0 6px 0', color: light.color }}>Skor Anda: {finalScore}</h3>
            <p style={{ color: light.color, fontWeight: '600', margin: '0 0 8px 0' }}>{light.text}</p>
            <p style={{ color: light.color, fontSize: '0.9rem', margin: 0 }}>{light.desc}</p>
          </div>

          <br />
          <Link to="/" style={{ ...btnPrimary, display: 'inline-block', textDecoration: 'none', maxWidth: '300px' }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

// Styles
const pageWrapper = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f5f3ff 100%)',
  padding: '20px',
};

const cardStyle = {
  background: 'white',
  borderRadius: '20px',
  padding: '40px 35px',
  maxWidth: '500px',
  width: '100%',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  border: '1px solid #e5e7eb',
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  background: '#f9fafb',
  boxSizing: 'border-box',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontWeight: '600',
  color: '#333',
  marginBottom: '8px',
  fontSize: '0.95rem',
};

const btnPrimary = {
  width: '100%',
  padding: '14px',
  background: '#18804e',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: '700',
  cursor: 'pointer',
  marginTop: '10px',
  textAlign: 'center',
};
