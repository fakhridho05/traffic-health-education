import { createContext, useState, useContext, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const ScoreContext = createContext();

export function ScoreProvider({ children }) {
  const { user, userProfile } = useAuth();
  const [preTestScore, setPreTestScoreState] = useState(null);
  const [postTestScore, setPostTestScoreState] = useState(null);
  const [completedModules, setCompletedModulesState] = useState([]);
  const [openedTabs, setOpenedTabsState] = useState({});
  const [completedKuesioner, setCompletedKuesionerState] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Load progress dari Firestore saat user login
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setPreTestScoreState(null);
        setPostTestScoreState(null);
        setCompletedModulesState([]);
        setOpenedTabsState({});
        setCompletedKuesionerState([]);
        setLoadingProgress(false);
        return;
      }
      try {
        const progressRef = doc(db, 'users', user.uid, 'progress', 'data');
        const progressSnap = await getDoc(progressRef);
        if (progressSnap.exists()) {
          const data = progressSnap.data();
          setPreTestScoreState(data.preTestScore ?? null);
          setPostTestScoreState(data.postTestScore ?? null);
          setCompletedModulesState(data.completedModules ?? []);
          setOpenedTabsState(data.openedTabs ?? {});
          setCompletedKuesionerState(data.completedKuesioner ?? []);
        }
      } catch (err) {
        console.error('Error loading progress:', err);
      }
      setLoadingProgress(false);
    };
    loadProgress();
  }, [user]);

  // Simpan progress ke Firestore
  const saveProgress = async (data) => {
    if (!user) return;
    try {
      const progressRef = doc(db, 'users', user.uid, 'progress', 'data');
      await setDoc(progressRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const saveTestResult = async (type, score, answersData = {}) => {
    if (!user) return;
    try {
      import('firebase/firestore').then(({ collection, addDoc, serverTimestamp }) => {
        addDoc(collection(db, 'test_results'), {
          userId: user.uid,
          userName: userProfile?.namaIbu || 'Tanpa Nama',
          type: type,
          score: score,
          answers: answersData,
          createdAt: serverTimestamp()
        });
      });
    } catch (err) {
      console.error('Error saving test result to global collection:', err);
    }
  };

  const setPreTestScore = async (score, answers = {}) => {
    setPreTestScoreState(score);
    await saveProgress({ preTestScore: score });
    await saveTestResult('Pre-Test', score, answers);
  };

  const setPostTestScore = async (score, answers = {}) => {
    setPostTestScoreState(score);
    await saveProgress({ postTestScore: score });
    await saveTestResult('Post-Test', score, answers);
  };

  const markModuleCompleted = async (moduleId) => {
    if (completedModules.includes(moduleId)) return;
    const updated = [...completedModules, moduleId];
    setCompletedModulesState(updated);
    await saveProgress({ completedModules: updated });
  };

  const markKuesionerCompleted = async (kuesionerId) => {
    if (completedKuesioner.includes(kuesionerId)) return;
    const updated = [...completedKuesioner, kuesionerId];
    setCompletedKuesionerState(updated);
    await saveProgress({ completedKuesioner: updated });
  };

  const markTabOpened = async (moduleId, tabName) => {
    const currentTabs = openedTabs[moduleId] || [];
    if (currentTabs.includes(tabName)) return;
    const updatedTabs = {
      ...openedTabs,
      [moduleId]: [...currentTabs, tabName]
    };
    setOpenedTabsState(updatedTabs);
    await saveProgress({ openedTabs: updatedTabs });
  };

  // Fungsi helper untuk menentukan warna lampu lalu lintas
  const getTrafficLight = (scorePercentage) => {
    if (scorePercentage >= 76) return { color: 'green', text: 'Baik', label: '🟢 Hijau' };
    if (scorePercentage >= 56) return { color: 'yellow', text: 'Cukup', label: '🟡 Kuning' };
    return { color: 'red', text: 'Kurang', label: '🔴 Merah' };
  };

  return (
    <ScoreContext.Provider value={{ 
      preTestScore, setPreTestScore, 
      postTestScore, setPostTestScore,
      completedModules, markModuleCompleted,
      completedKuesioner, markKuesionerCompleted,
      openedTabs, markTabOpened,
      loadingProgress,
      getTrafficLight
    }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  return useContext(ScoreContext);
}
