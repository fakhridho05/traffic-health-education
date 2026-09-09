import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useScore } from '../context/ScoreContext';
import { useQuiz } from '../hooks/useQuiz';

export default function PreTest() {
  const { questions: QUESTIONS, loading } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const { setPreTestScore, preTestScore, getTrafficLight } = useScore();
  const navigate = useNavigate();

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
    setPreTestScore(percentage);
    setShowResult(true);
  };

  if (showResult && preTestScore !== null) {
    const light = getTrafficLight(preTestScore);
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '40px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
        <h2 style={{ fontSize: '2rem', color: '#18312a', marginBottom: '10px' }}>Terima Kasih, Bunda! 🎉</h2>
        <p style={{ color: '#555', marginBottom: '30px' }}>
          Pre-Test telah berhasil diselesaikan. <br/>
          Skor ini akan menjadi acuan Bunda dalam mempelajari materi edukasi.
        </p>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'inline-block', marginBottom: '30px', border: `2px solid var(--color-${light.color})` }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Skor Awal Anda: {preTestScore}</h3>
          <span style={{ fontSize: '1.2rem' }}>{light.label}</span>
        </div>
        <br/>
        <Link to="/pre-post-test" className="auth-btn" style={{ display: 'inline-block', width: 'auto', padding: '12px 32px', textDecoration: 'none' }}>
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
          <h2 style={{ fontSize: '1.5rem', color: '#18312a' }}>Pre Test</h2>
          <div style={{ background: '#f5f9f7', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', color: '#2b8a67', fontWeight: '600' }}>
            {currentQuestion + 1} / {QUESTIONS.length}
          </div>
        </div>
        <p style={{ color: '#555', marginBottom: '30px', fontSize: '0.95rem' }}>Pilihlah satu jawaban yang paling tepat.</p>

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
                <span style={{ color: answers[q.id] === index ? '#18804e' : '#555', fontWeight: answers[q.id] === index ? '600' : '400' }}>
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
            style={{ padding: '12px 24px', background: '#18804e', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: '600' }}
          >
            {currentQuestion === QUESTIONS.length - 1 ? 'Kirim' : 'Selanjutnya'}
          </button>
        </div>
      </div>
    </div>
  );
}
