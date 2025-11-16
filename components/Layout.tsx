
import React, { ReactNode } from 'react';
import { useApp } from '../contexts/AppContext';
import { Home, Users, ShoppingCart, Package, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentPage, setCurrentPage } = useApp();

  const navItems = [
    { page: 'home', icon: Home, label: 'Home' },
    { page: 'customers', icon: Users, label: 'Customers' },
    { page: 'inventory', icon: Package, label: 'Inventory' },
    { page: 'sales', icon: ShoppingCart, label: 'Sales' },
    { page: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow overflow-y-auto pb-20">
        {children}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page as any)}
              className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
                currentPage === item.page || (item.page === 'inventory' && ['products', 'purchases', 'addPurchase'].includes(currentPage)) 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
