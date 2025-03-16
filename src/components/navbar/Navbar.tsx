
import { useState, useEffect } from 'react';
import { BarChart3, BookOpen } from 'lucide-react';
import { useAuth } from '@/utils/auth';
import NavbarLogo from './NavbarLogo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role } = useAuth();

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
          <NavbarLogo onClick={closeMenu} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks navItems={navItems} />
            <UserMenu />
          </div>

          <MobileMenu 
            isOpen={isOpen} 
            toggleMenu={toggleMenu} 
            closeMenu={closeMenu} 
            navItems={navItems} 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
