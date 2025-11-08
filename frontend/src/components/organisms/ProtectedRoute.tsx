import { Navigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
