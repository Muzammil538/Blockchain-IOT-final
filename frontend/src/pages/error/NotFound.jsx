import { Link } from 'react-router';
import { useResponsive } from '../../hooks/useResponsive';

export default function NotFound() {
  const { isMobile } = useResponsive();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className={`block w-full ${isMobile ? 'py-3' : 'py-2'} px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors`}
          >
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className={`block w-full ${isMobile ? 'py-3' : 'py-2'} px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors`}
          >
            Go Back
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link to="/contact" className="text-blue-600 hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}