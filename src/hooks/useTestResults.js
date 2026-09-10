import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export function useTestResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'test_results'), orderBy('createdAt', 'desc'));
    
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
      setResults(arr);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching test results:', err);
      setError(err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { results, loading, error };
}
