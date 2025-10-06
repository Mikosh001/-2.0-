import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Toast } from '../components/Toast';
import Home from './Home';
import Professions from './Professions';
import Stories from './Stories';
import Blog from './Blog';
import QuizPage from './Quiz';
import Sim from './Sim';
import Portfolio from './Portfolio';
import Jobs from './Jobs';
import Mentors from './Mentors';
import EmployerJobs from './EmployerJobs';
import Admin from './Admin';
import AuthLogin from './AuthLogin';
import AuthRegister from './AuthRegister';
import { useAuthStore, AuthProvider } from '../store/auth';
import { QuizProvider } from '../store/quiz';
import { UIProvider, useUI } from '../store/ui';
import CoursePage from './CourseDetail';
import LearningPage from './Learning';

const Protected = ({ roles, children }: { roles?: string[]; children: JSX.Element }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/auth/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppShell = () => {
  const { toast, clearToast } = useUI();
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/professions" element={<Professions />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/blog" element={<Blog />} />
          <Route
            path="/learning"
            element={
              <Protected roles={['student']}>
                <LearningPage />
              </Protected>
            }
          />
          <Route
            path="/course/:id"
            element={
              <Protected roles={['student']}>
                <CoursePage />
              </Protected>
            }
          />
          <Route
            path="/quiz/:courseId"
            element={
              <Protected roles={['student']}>
                <QuizPage />
              </Protected>
            }
          />
          <Route
            path="/sim"
            element={
              <Protected roles={['student']}>
                <Sim />
              </Protected>
            }
          />
          <Route
            path="/portfolio"
            element={
              <Protected roles={['student']}>
                <Portfolio />
              </Protected>
            }
          />
          <Route
            path="/jobs"
            element={
              <Protected roles={['student']}>
                <Jobs />
              </Protected>
            }
          />
          <Route
            path="/mentors"
            element={
              <Protected roles={['student']}>
                <Mentors />
              </Protected>
            }
          />
          <Route
            path="/employer/jobs"
            element={
              <Protected roles={['employer']}>
                <EmployerJobs />
              </Protected>
            }
          />
          <Route
            path="/admin"
            element={
              <Protected roles={['admin']}>
                <Admin />
              </Protected>
            }
          />
          <Route path="/auth/login" element={<AuthLogin />} />
          <Route path="/auth/register" element={<AuthRegister />} />
          <Route path="/u/:id" element={<Portfolio isPublic />} />
        </Routes>
      </main>
      <Footer />
      <Toast message={toast} onClose={clearToast} />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <UIProvider>
      <QuizProvider>
        <AppShell />
      </QuizProvider>
    </UIProvider>
  </AuthProvider>
);

export default App;
