// App.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import RootLayout from './pages/Layout'; 
import { LoginForm } from './components/auth/LoginForm';
import { InscriptionForm } from './components/inscription/InscriptionForm';
import { LandingPage } from './components/landing/Landingpage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import DashboardPage from './pages/dashboard/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
            <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/inscription" element={<InscriptionForm />} />
          <Route path="/dashboard" element={
            <DashboardPage>
              <AdminDashboard />
              <StudentDashboard />
            </DashboardPage>} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
