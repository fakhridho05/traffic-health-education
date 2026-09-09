import { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { QUIZ_QUESTIONS } from '../data/quizData';

export async function seedQuizToFirestore() {
  const quizRef = collection(db, 'quiz');
  const snap = await getDocs(quizRef);
  
  const existingIds = new Set();
  snap.forEach((d) => existingIds.add(d.id));

  let seededCount = 0;
  
  for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
    const q = QUIZ_QUESTIONS[i];
    const id = String(q.id); // Firestore IDs are strings
    if (!existingIds.has(id)) {
      await setDoc(doc(db, 'quiz', id), {
        ...q,
        id,
        order: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      seededCount++;
    }
  }
  
  console.log(`Seeded ${seededCount} missing quiz questions to Firestore.`);
  return seededCount > 0;
}

export function useQuiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'quiz'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        setQuestions(QUIZ_QUESTIONS);
      } else {
        const arr = [];
        snap.forEach((d) => {
          arr.push({ ...d.data(), id: d.id });
        });
        setQuestions(arr);
      }
      setLoading(false);
    }, (err) => {
      console.error('Error loading quiz:', err);
      setQuestions(QUIZ_QUESTIONS);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addQuestion = async (data) => {
    // Generate an ID if not provided
    const id = data.id || `q_${Date.now()}`;
    await setDoc(doc(db, 'quiz', id), {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return id;
  };

  const updateQuestion = async (id, data) => {
    await setDoc(doc(db, 'quiz', id), {
      ...data,
      id,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const deleteQuestion = async (id) => {
    await deleteDoc(doc(db, 'quiz', id));
  };

  return { questions, loading, addQuestion, updateQuestion, deleteQuestion };
}
