
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen } from 'lucide-react';

type NavItem = {
  name: string;
  path: string;
  icon?: React.ReactNode;
};

type NavLinksProps = {
  navItems: NavItem[];
  mobile?: boolean;
  onClick?: () => void;
};

const NavLinks = ({ navItems, mobile = false, onClick }: NavLinksProps) => {
  const location = useLocation();
  
  if (navItems.length === 0) return null;
  
  return (
    <div className={mobile ? "flex flex-col space-y-4 pt-2 pb-3" : "flex space-x-4"}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`${
            mobile
              ? `px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`
              : `text-sm font-medium transition-colors duration-300 flex items-center ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`
          }`}
          onClick={onClick}
        >
          {item.icon && item.icon}
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
