
import { Menu, X } from 'lucide-react';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';

type MobileMenuProps = {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  navItems: Array<{
    name: string;
    path: string;
    icon?: React.ReactNode;
  }>;
};

const MobileMenu = ({ isOpen, toggleMenu, closeMenu, navItems }: MobileMenuProps) => {
  return (
    <>
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

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen 
            ? 'max-h-screen opacity-100 py-4'
            : 'max-h-0 opacity-0'
        }`}
      >
        <NavLinks 
          navItems={navItems} 
          mobile={true} 
          onClick={closeMenu} 
        />
        <UserMenu mobile={true} onClose={closeMenu} />
      </div>
    </>
  );
};

export default MobileMenu;
