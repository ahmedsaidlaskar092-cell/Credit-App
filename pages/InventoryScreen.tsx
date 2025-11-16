
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Package, PlusCircle, History } from 'lucide-react';
import Card from '../components/Card';

const InventoryScreen: React.FC = () => {
  const { setCurrentPage, products, purchaseEntries } = useApp();

  const totalStockValue = products.reduce((total, product) => {
    return total + (product.stockQty * product.sellingPrice);
  }, 0);

  const totalUnpaidPurchases = purchaseEntries
    .filter(p => p.paymentStatus === 'unpaid')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const menuItems = [
    { label: 'Manage Products', icon: Package, page: 'products', color: 'text-blue-600' },
    { label: 'Add New Purchase', icon: PlusCircle, page: 'addPurchase', color: 'text-green-600' },
    { label: 'View Purchases', icon: History, page: 'purchases', color: 'text-purple-600' },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white animate-spring-in">
          <h2 className="text-lg font-semibold opacity-80">Total Stock Value</h2>
          <p className="text-3xl font-bold">₹{totalStockValue.toLocaleString('en-IN')}</p>
          <p className="text-sm opacity-80 mt-1">{products.length} products</p>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white animate-spring-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-semibold opacity-80">Unpaid Purchases</h2>
          <p className="text-3xl font-bold">₹{totalUnpaidPurchases.toLocaleString('en-IN')}</p>
          <p className="text-sm opacity-80 mt-1">Payable to suppliers</p>
        </Card>
      </div>

      <div className="space-y-3">
        {menuItems.map(item => (
          <div
            key={item.label}
            onClick={() => setCurrentPage(item.page as any)}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center"
          >
            <div className={`p-3 rounded-full bg-gray-100 mr-4 ${item.color}`}>
              <item.icon size={24} />
            </div>
            <span className="font-semibold text-gray-800 text-lg">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryScreen;