import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const userSignedIn = localStorage.getItem('userSignedIn');
  
  const isAuthenticated = userSignedIn === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
