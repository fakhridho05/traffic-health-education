import { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { MODULES_DATA } from '../data/modulesData';

// Seed: upload data statis ke Firestore (hanya jika collection kosong)
export async function seedModulesToFirestore() {
  const modulesRef = collection(db, 'modules');
  const snap = await getDocs(modulesRef);
  
  // Ambil id modul yang sudah ada di firestore
  const existingIds = new Set();
  snap.forEach((d) => existingIds.add(d.id));

  const entries = Object.values(MODULES_DATA);
  let seededCount = 0;
  
  for (let i = 0; i < entries.length; i++) {
    const m = entries[i];
    if (!existingIds.has(m.id)) {
      await setDoc(doc(db, 'modules', m.id), {
        ...m,
        order: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      seededCount++;
    }
  }
  
  console.log(`Seeded ${seededCount} missing modules to Firestore.`);
  return seededCount > 0;
}

// Hook utama: load modul dari Firestore secara realtime
export function useModules() {
  const [modules, setModules] = useState([]);
  const [modulesMap, setModulesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'modules'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        // Fallback ke data statis jika Firestore kosong
        const staticArr = Object.values(MODULES_DATA).map((m, i) => ({ ...m, order: i + 1 }));
        setModules(staticArr);
        setModulesMap(MODULES_DATA);
      } else {
        const arr = [];
        const map = {};
        snap.forEach((d) => {
          const data = { ...d.data(), id: d.id };
          arr.push(data);
          map[d.id] = data;
        });
        setModules(arr);
        setModulesMap(map);
      }
      setLoading(false);
    }, (err) => {
      console.error('Error loading modules:', err);
      // Fallback ke data statis
      const staticArr = Object.values(MODULES_DATA).map((m, i) => ({ ...m, order: i + 1 }));
      setModules(staticArr);
      setModulesMap(MODULES_DATA);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addModule = async (moduleData) => {
    const id = moduleData.id || String(modules.length + 1).padStart(2, '0');
    await setDoc(doc(db, 'modules', id), {
      ...moduleData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return id;
  };

  const updateModule = async (id, moduleData) => {
    await setDoc(doc(db, 'modules', id), {
      ...moduleData,
      id,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const deleteModule = async (id) => {
    await deleteDoc(doc(db, 'modules', id));
  };

  return { modules, modulesMap, loading, addModule, updateModule, deleteModule };
}
