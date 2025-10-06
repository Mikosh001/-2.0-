import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Professions from './pages/Professions';
import Stories from './pages/Stories';
import Blog from './pages/Blog';
import Learning from './pages/Learning';
import CourseDetail from './pages/CourseDetail';
import QuizPage from './pages/Quiz';
import Sim from './pages/Sim';
import Portfolio from './pages/Portfolio';
import Jobs from './pages/Jobs';
import Mentors from './pages/Mentors';
import EmployerJobs from './pages/EmployerJobs';
import AdminDashboard from './pages/Admin';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import ProtectedRoute from './utils/ProtectedRoute';
import { ToastContext, ToastPayload } from './utils/ToastContext';
import PublicProfile from './pages/PublicProfile';

const App = () => {
  const [toast, setToast] = useState<ToastPayload>(null);

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      <div className="app-shell">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/professions" element={<Professions />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/blog" element={<Blog />} />
            <Route
              path="/learning"
              element={
                <ProtectedRoute roles={['student']}>
                  <Learning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:id"
              element={
                <ProtectedRoute roles={['student', 'admin']}>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:courseId"
              element={
                <ProtectedRoute roles={['student']}>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sim"
              element={
                <ProtectedRoute roles={['student']}>
                  <Sim />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute roles={['student']}>
                  <Portfolio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute roles={['student']}>
                  <Jobs />
                </ProtectedRoute>
              }
            />
            <Route path="/mentors" element={<ProtectedRoute roles={['student']}><Mentors /></ProtectedRoute>} />
            <Route
              path="/employer/jobs"
              element={
                <ProtectedRoute roles={['employer']}>
                  <EmployerJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/login" element={<AuthLogin />} />
            <Route path="/auth/register" element={<AuthRegister />} />
            <Route path="/u/:id" element={<PublicProfile />} />
          </Routes>
        </main>
        <Footer />
        <Toast message={toast?.message ?? null} type={toast?.type} onClose={() => setToast(null)} />
      </div>
    </ToastContext.Provider>
  );
};

export default App;
