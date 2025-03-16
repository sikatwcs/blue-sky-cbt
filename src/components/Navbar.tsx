
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, BookOpen, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/utils/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, role, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    ...(user
      ? [
          { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="w-4 h-4 mr-1" /> },
          { name: 'Exams', path: '/exams', icon: <BookOpen className="w-4 h-4 mr-1" /> }
        ]
      : []),
    ...(role === 'admin'
      ? [{ name: 'Admin Panel', path: '/admin' }]
      : []),
    ...(role === 'questioner'
      ? [{ name: 'Question Management', path: '/questioner' }]
      : []),
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">CB</span>
            </div>
            <span className="text-xl font-semibold text-blue-900">BlueCBT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-300 flex items-center ${
                    location.pathname === item.path
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.icon && item.icon}
                  {item.name}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost" 
                  className="flex items-center text-gray-600 hover:text-blue-600"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </Button>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-50 text-blue-700"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name || 'Profile'}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth?mode=login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-blue-900" />
            ) : (
              <Menu className="w-6 h-6 text-blue-900" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen 
              ? 'max-h-screen opacity-100 py-4'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-4 pt-2 pb-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
                onClick={closeMenu}
              >
                {item.icon && item.icon}
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={closeMenu}
                >
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Link>
                <button
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link
                  to="/auth?mode=login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={closeMenu}
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="block px-3 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 text-center"
                  onClick={closeMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
