import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import ClubDashboard from '../pages/ClubDashboard';
import JoueurDashboard from '../pages/JoueurDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/club" element={
        <ProtectedRoute>
          <ClubDashboard />
        </ProtectedRoute>
      } />
      <Route path="/joueur" element={
  <ProtectedRoute>
    <JoueurDashboard />
  </ProtectedRoute>
} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
