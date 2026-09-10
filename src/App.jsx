import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScoreProvider } from './context/ScoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';

// Public & Normal User Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Edukasi from './pages/Edukasi';
import ModulDetail from './pages/ModulDetail';
import Kuesioner from './pages/Kuesioner';
import KuesionerForm from './pages/KuesionerForm';
import PrePostMenu from './pages/PrePostMenu';
import PreTest from './pages/PreTest';
import PostTest from './pages/PostTest';
import Progress from './pages/Progress';
import Profil from './pages/Profil';
import Bantuan from './pages/Bantuan';
import LengkapiProfil from './pages/LengkapiProfil';
import NotFound from './pages/NotFound';
import PublicTest from './pages/PublicTest';

// Lazy load Admin Pages to reduce main bundle size
const AdminModules = lazy(() => import('./pages/AdminModules'));
const AdminModulForm = lazy(() => import('./pages/AdminModulForm'));
const AdminKuesioner = lazy(() => import('./pages/AdminKuesioner'));
const AdminKuesionerForm = lazy(() => import('./pages/AdminKuesionerForm'));
const AdminKuesionerHasil = lazy(() => import('./pages/AdminKuesionerHasil'));
const AdminQuiz = lazy(() => import('./pages/AdminQuiz'));
const AdminQuizForm = lazy(() => import('./pages/AdminQuizForm'));
const AdminTesHasil = lazy(() => import('./pages/AdminTesHasil'));
const AdminPanduan = lazy(() => import('./pages/AdminPanduan'));

// Loading Fallback Component
const PageLoader = () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#888' }}>Memuat...</div>;

// Protected Route: redirect ke /login jika belum login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;
  return children;
}

// Profile Guard: redirect ke /lengkapi-profil jika profil belum lengkap
function ProfileGuard({ children }) {
  const { user, userProfile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;
  if (!userProfile || !userProfile.profileCompleted) return <Navigate to="/lengkapi-profil" />;
  return children;
}

// Admin Guard: hanya admin yang bisa mengakses
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/beranda" />;
  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/seminar/:type" element={<PublicTest />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lengkapi-profil" element={
          <ProtectedRoute>
            <LengkapiProfil />
          </ProtectedRoute>
        } />
        
        {/* Main Routes with Sidebar (Protected + Profile Complete) */}
        <Route element={
          <ProfileGuard>
            <DashboardLayout />
          </ProfileGuard>
        }>
          <Route path="/beranda" element={<Home />} />
          <Route path="/kuesioner" element={<Kuesioner />} />
          <Route path="/kuesioner/:id" element={<KuesionerForm />} />
          <Route path="/pre-post-test" element={<PrePostMenu />} />
          <Route path="/pre-test" element={<PreTest />} />
          <Route path="/edukasi" element={<Edukasi />} />
          <Route path="/edukasi/:id" element={<ModulDetail />} />
          <Route path="/post-test" element={<PostTest />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/bantuan" element={<Bantuan />} />

          {/* Admin Routes */}
          <Route path="/admin/modules" element={<AdminRoute><AdminModules /></AdminRoute>} />
          <Route path="/admin/modules/tambah" element={<AdminRoute><AdminModulForm /></AdminRoute>} />
          <Route path="/admin/modules/edit/:id" element={<AdminRoute><AdminModulForm /></AdminRoute>} />

          <Route path="/admin/kuesioner" element={<AdminRoute><AdminKuesioner /></AdminRoute>} />
          <Route path="/admin/kuesioner/tambah" element={<AdminRoute><AdminKuesionerForm /></AdminRoute>} />
          <Route path="/admin/kuesioner/edit/:id" element={<AdminRoute><AdminKuesionerForm /></AdminRoute>} />
          <Route path="/admin/kuesioner/hasil" element={<AdminRoute><AdminKuesionerHasil /></AdminRoute>} />

          <Route path="/admin/quiz" element={<AdminRoute><AdminQuiz /></AdminRoute>} />
          <Route path="/admin/quiz/tambah" element={<AdminRoute><AdminQuizForm /></AdminRoute>} />
          <Route path="/admin/quiz/edit/:id" element={<AdminRoute><AdminQuizForm /></AdminRoute>} />
          <Route path="/admin/tes/hasil" element={<AdminRoute><AdminTesHasil /></AdminRoute>} />
          <Route path="/admin/panduan" element={<AdminRoute><AdminPanduan /></AdminRoute>} />
        </Route>

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <ScoreProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ScoreProvider>
    </AuthProvider>
  );
}

export default App;
