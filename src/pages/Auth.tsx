
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from '@/utils/auth';

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                Or{' '}
                <a href="/auth?mode=register" className="font-medium text-blue-600 hover:text-blue-500">
                  create a new account
                </a>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <a href="/auth?mode=login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </a>
              </>
            )}
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
