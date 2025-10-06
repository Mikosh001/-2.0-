import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
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
import Admin from './pages/Admin';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import { useAuthStore } from './store/auth';
import { ToastProvider } from './components/Toast';
import PortfolioPublic from './pages/PortfolioPublic';

const ProtectedRoute = ({ children, roles }: { children: JSX.Element; roles?: string[] }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/auth/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <ToastProvider>
      <div className="app-shell">
        <Navbar />
        <main style={{ minHeight: '80vh', padding: '2rem', display: 'grid', gap: '2rem' }}>
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
                <ProtectedRoute roles={['student']}>
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
            <Route path="/u/:id" element={<PortfolioPublic />} />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute roles={['student']}>
                  <Jobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentors"
              element={
                <ProtectedRoute roles={['student']}>
                  <Mentors />
                </ProtectedRoute>
              }
            />
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
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/login" element={<AuthLogin />} />
            <Route path="/auth/register" element={<AuthRegister />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
