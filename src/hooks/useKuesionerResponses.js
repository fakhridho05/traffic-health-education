import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export function useKuesionerResponses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'kuesioner_responses'), orderBy('createdAt', 'desc'));
    
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach(doc => {
        const data = doc.data();
        arr.push({
          id: doc.id,
          ...data,
          // Format date for easier display
          dateStr: data.createdAt ? data.createdAt.toDate().toLocaleString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }) : 'Baru saja'
        });
      });
      setResponses(arr);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching responses:', err);
      setError(err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { responses, loading, error };
}
