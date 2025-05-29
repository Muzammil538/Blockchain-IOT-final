import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { useResponsive } from '../../hooks/useResponsive';

export default function Unauthorized() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  useEffect(() => {
    // If no user is logged in, redirect to login after 3 seconds
    if (!currentUser) {
      const timer = setTimeout(() => {
        navigate('/login', { state: { from: location.pathname } });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-6">
          {currentUser
            ? "You don't have permission to access this page."
            : "You need to be logged in to access this page. Redirecting to login..."}
        </p>

        <div className="space-y-3">
          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                className={`block w-full ${isMobile ? 'py-3' : 'py-2'} px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors`}
              >
                Go to Dashboard
              </Link>
              <Link
                to="/contact"
                className={`block w-full ${isMobile ? 'py-3' : 'py-2'} px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors`}
              >
                Request Access
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className={`block w-full ${isMobile ? 'py-3' : 'py-2'} px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors`}
            >
              Go to Login Page
            </Link>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Having trouble?{' '}
            <Link to="/contact" className="text-blue-600 hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}