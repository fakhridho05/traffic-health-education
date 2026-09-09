import { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { KUESIONER_DB } from '../data/kuesionerData';

export async function seedKuesionerToFirestore() {
  const kuesionerRef = collection(db, 'kuesioner');
  const snap = await getDocs(kuesionerRef);
  
  const existingIds = new Set();
  snap.forEach((d) => existingIds.add(d.id));

  const entries = Object.entries(KUESIONER_DB);
  let seededCount = 0;
  
  for (let i = 0; i < entries.length; i++) {
    const [id, data] = entries[i];
    if (!existingIds.has(id)) {
      await setDoc(doc(db, 'kuesioner', id), {
        ...data,
        id,
        order: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      seededCount++;
    }
  }
  
  console.log(`Seeded ${seededCount} missing kuesioner to Firestore.`);
  return seededCount > 0;
}

export function useKuesioner() {
  const [kuesionerList, setKuesionerList] = useState([]);
  const [kuesionerMap, setKuesionerMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'kuesioner'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        // Fallback
        const staticArr = Object.entries(KUESIONER_DB).map(([id, data], i) => ({ ...data, id, order: i + 1 }));
        setKuesionerList(staticArr);
        setKuesionerMap(KUESIONER_DB);
      } else {
        const arr = [];
        const map = {};
        snap.forEach((d) => {
          const data = { ...d.data(), id: d.id };
          arr.push(data);
          map[d.id] = data;
        });
        setKuesionerList(arr);
        setKuesionerMap(map);
      }
      setLoading(false);
    }, (err) => {
      console.error('Error loading kuesioner:', err);
      const staticArr = Object.entries(KUESIONER_DB).map(([id, data], i) => ({ ...data, id, order: i + 1 }));
      setKuesionerList(staticArr);
      setKuesionerMap(KUESIONER_DB);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addKuesioner = async (data) => {
    const id = data.id || `kuesioner_${Date.now()}`;
    await setDoc(doc(db, 'kuesioner', id), {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return id;
  };

  const updateKuesioner = async (id, data) => {
    await setDoc(doc(db, 'kuesioner', id), {
      ...data,
      id,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const deleteKuesioner = async (id) => {
    await deleteDoc(doc(db, 'kuesioner', id));
  };

  return { kuesionerList, kuesionerMap, loading, addKuesioner, updateKuesioner, deleteKuesioner };
}
