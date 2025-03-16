import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/utils/auth';

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, mode:", mode);
    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'register') {
        console.log("Attempting registration with:", { 
          name: formData.name, 
          email: formData.email 
        });
        
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        
        await register(formData.name, formData.email, formData.password);
        console.log("Registration successful");
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        });
        navigate('/dashboard');
      } else {
        console.log("Attempting login with:", { email: formData.email });
        await login(formData.email, formData.password);
        console.log("Login successful");
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h2 className="text-2xl font-bold text-center">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-blue-100 text-center mt-2">
            {mode === 'login' 
              ? 'Sign in to access your account' 
              : 'Join us to take tests and track your progress'}
          </p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full mt-6 btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign in' : 'Create account'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a
                  href="/auth?mode=register"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up
                </a>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{' '}
                <a
                  href="/auth?mode=login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign in
                </a>
              </p>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
