import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
  const userSignedIn = localStorage.getItem('userSignedIn');
  
  const isAuthenticated = userSignedIn === 'true';

  // If user is already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
