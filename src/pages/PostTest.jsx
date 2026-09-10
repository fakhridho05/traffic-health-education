import { useState } from 'react';
import { useScore } from '../context/ScoreContext';
import { Link } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';

export default function PostTest() {
  const { questions: QUESTIONS, loading } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const { preTestScore, setPostTestScore, postTestScore, getTrafficLight } = useScore();

  if (loading) return <div style={{ padding: '20px' }}>Memuat soal...</div>;

  const handleSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert("Harap jawab semua pertanyaan terlebih dahulu.");
      return;
    }

    let correctCount = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / QUESTIONS.length) * 100);

    // Build detailed answers data
    const answersData = {};
    QUESTIONS.forEach(q => {
      answersData[q.question] = {
        jawaban: q.options[answers[q.id]],
        benar: q.options[q.correctAnswer],
        status: answers[q.id] === q.correctAnswer ? 'Benar' : 'Salah'
      };
    });

    setPostTestScore(percentage, answersData);
    setShowResult(true);
  };

  if (showResult && postTestScore !== null) {
    const postLight = getTrafficLight(postTestScore);
    const preLight = preTestScore !== null ? getTrafficLight(preTestScore) : null;

    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '10px' }}>Hasil Evaluasi Akhir Bunda 🎉</h2>
        <p style={{ color: '#555', marginBottom: '30px' }}>
          Mari kita lihat perbandingan skor sebelum dan sesudah Bunda belajar materi edukasi.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {/* Pre Test Result */}
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', minWidth: '250px', border: `3px solid ${preLight ? 'var(--color-' + preLight.color + ')' : '#eee'}` }}>
            <h4 style={{ color: '#666', marginBottom: '10px' }}>Skor Awal (Pre-Test)</h4>
            <h2 style={{ fontSize: '3rem', color: '#333', margin: '0 0 10px 0' }}>{preTestScore !== null ? preTestScore : '?'}</h2>
            <p style={{ fontWeight: '600', color: '#555' }}>{preLight ? preLight.label : 'Belum Tes'}</p>
          </div>
          
          {/* Post Test Result */}
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', minWidth: '250px', border: `3px solid var(--color-${postLight.color})` }}>
            <h4 style={{ color: '#666', marginBottom: '10px' }}>Skor Akhir (Post-Test)</h4>
            <h2 style={{ fontSize: '3rem', color: '#333', margin: '0 0 10px 0' }}>{postTestScore}</h2>
            <p style={{ fontWeight: '600', color: '#555' }}>{postLight.label}</p>
          </div>
        </div>

        <p style={{ fontSize: '1.1rem', color: '#18312a', background: '#f0fcf5', padding: '20px', borderRadius: '12px', display: 'inline-block', marginBottom: '30px', borderLeft: '4px solid #18804e' }}>
          {postTestScore > (preTestScore || 0) 
            ? "Luar biasa! Terdapat peningkatan pemahaman Bunda setelah membaca materi edukasi." 
            : "Terima kasih sudah belajar. Bunda bisa kembali membaca modul kapan saja untuk memperkuat pemahaman."}
        </p>
        <br/>
        <Link to="/pre-post-test" className="btn-primary-pill" style={{ padding: '12px 40px', textDecoration: 'none' }}>
          Kembali ke Menu
        </Link>
      </div>
    );
  }

  const q = QUESTIONS[currentQuestion];

  return (
    <div className="animate-fade-in">
      <Link to="/pre-post-test" style={{ color: '#555', textDecoration: 'none', marginBottom: '20px', display: 'inline-block', fontWeight: '600' }}>
        &lt; Kembali
      </Link>
      
      <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#00287a' }}>Post Test</h2>
          <div style={{ background: '#eaf2f8', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', color: '#2980b9', fontWeight: '600' }}>
            {currentQuestion + 1} / {QUESTIONS.length}
          </div>
        </div>
        <p style={{ color: '#555', marginBottom: '30px', fontSize: '0.95rem' }}>Pilihlah satu jawaban yang paling tepat.</p>

        <div style={{ background: '#f4f8fb', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <p style={{ fontWeight: '600', marginBottom: '20px', color: '#00287a', fontSize: '1.05rem', lineHeight: '1.5' }}>{q.question}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {q.options.map((opt, index) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name={`q-${q.id}`}
                  checked={answers[q.id] === index}
                  onChange={() => handleSelect(q.id, index)}
                  style={{ width: '18px', height: '18px', accentColor: '#2980b9' }}
                />
                <span style={{ color: answers[q.id] === index ? '#2980b9' : '#555', fontWeight: answers[q.id] === index ? '600' : '400' }}>
                  {opt}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            type="button" 
            onClick={handlePrev}
            style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #ddd', borderRadius: '8px', cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer', color: currentQuestion === 0 ? '#aaa' : '#333', fontWeight: '600' }}
            disabled={currentQuestion === 0}
          >
            Sebelumnya
          </button>
          
          <button 
            type="button" 
            onClick={handleNext}
            style={{ padding: '12px 24px', background: '#2980b9', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: '600' }}
          >
            {currentQuestion === QUESTIONS.length - 1 ? 'Kirim Post Test' : 'Selanjutnya'}
          </button>
        </div>
      </div>
    </div>
  );
}
