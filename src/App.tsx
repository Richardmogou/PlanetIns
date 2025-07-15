// App.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import RootLayout from './pages/Layout'; // Chemin vers votre composant de mise en page
import { LoginForm } from './components/auth/LoginForm';
import { InscriptionForm } from './components/inscription/InscriptionForm';
import { LandingPage } from './components/landing/Landingpage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { LayoutDashboard } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
            <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/inscription" element={<InscriptionForm />} />
          <Route path="/dashboard" element={<LayoutDashboard />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
