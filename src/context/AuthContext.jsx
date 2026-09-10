import { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = userProfile?.role === 'admin';

  // Load profil user dari Firestore
  const loadUserProfile = async (uid) => {
    try {
      const profileRef = doc(db, 'users', uid, 'profile', 'data');
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setUserProfile(data);
        return data;
      }
      setUserProfile(null);
      return null;
    } catch (err) {
      console.error('Error loading profile:', err);
      setUserProfile(null);
      return null;
    }
  };

  // Listener: otomatis cek status login saat app dimuat
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Register dengan email & password
  const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    return result.user;
  };

  // Login dengan email & password
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    const profile = await loadUserProfile(result.user.uid);
    return { user: result.user, profile };
  };

  // Login / Register dengan Google
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
    const profile = await loadUserProfile(result.user.uid);
    return { user: result.user, profile };
  };

  // Simpan profil ke Firestore
  const saveProfile = async (profileData) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
    const dataToSave = {
      ...profileData,
      email: user.email,
      profileCompleted: true,
      createdAt: new Date().toISOString()
    };
    await setDoc(profileRef, dataToSave, { merge: true });
    setUserProfile(dataToSave);
  };

  // Update profil ke Firestore (tanpa menimpa createdAt)
  const updateProfile = async (profileData) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
    const updated = { ...profileData, updatedAt: new Date().toISOString() };
    await setDoc(profileRef, updated, { merge: true });
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // Reset Password
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      isAdmin,
      loading, 
      register, 
      login, 
      loginWithGoogle, 
      logout, 
      resetPassword,
      saveProfile,
      updateProfile,
      loadUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
