import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import AuthLayout from '../../components/auth/AuthLayout';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const { values, handleChange } = useForm({
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await resetPassword(values.email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={success 
        ? "We've sent a password reset link to your email" 
        : "Enter your email to receive a reset link"}
    >
      {success ? (
        <div className="text-center">
          <Link
            to="/login"
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send Reset Link
            </button>
          </div>

          <div className="text-sm text-center">
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Remember your password? Sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}