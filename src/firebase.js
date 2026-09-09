// Firebase Configuration
// =====================
// PETUNJUK: Ganti nilai-nilai di bawah dengan kredensial dari Firebase Console Anda.
// 1. Buka https://console.firebase.google.com
// 2. Buat project baru (atau buka project yang sudah ada)
// 3. Klik ikon ⚙️ > Project Settings > General
// 4. Scroll ke bawah, klik "Add app" > Web (</>)
// 5. Copy konfigurasi yang diberikan ke sini

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB9lxcPhCNjE3qxd3gQxK5HPf0ptH2Zy44",
  authDomain: "traffic-health-education.firebaseapp.com",
  projectId: "traffic-health-education",
  storageBucket: "traffic-health-education.firebasestorage.app",
  messagingSenderId: "345455579109",
  appId: "1:345455579109:web:9a843437de77fa3b7ea90c",
  measurementId: "G-1EXQKVP15G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
