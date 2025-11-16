
import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserPlus, PlusCircle, ShoppingBag, FileText, BellRing } from 'lucide-react';
import Card from '../components/Card';

const HomeScreen: React.FC = () => {
  const { setCurrentPage, creditEntries, saleEntries, user } = useApp();

  const totalOutstandingCredit = useMemo(() => {
    return creditEntries
      .filter(e => e.status === 'unpaid')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [creditEntries]);

  const todaysSale = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return saleEntries
      .filter(e => e.dateTime.startsWith(today))
      .reduce((sum, e) => sum + e.totalAmount, 0);
  }, [saleEntries]);
  
  const pendingRemindersCount = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return creditEntries.filter(e => {
        if (e.status === 'paid') return false;
        const dueDate = new Date(e.dueDate);
        dueDate.setHours(0,0,0,0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3; // Overdue or due within 3 days
    }).length;
  }, [creditEntries]);

  const menuItems = [
    { label: 'Add Customer', icon: UserPlus, page: 'addCustomer', color: 'bg-green-100', textColor: 'text-green-700' },
    { label: 'Give Credit', icon: PlusCircle, page: 'giveCredit', color: 'bg-blue-100', textColor: 'text-blue-700' },
    { label: 'Add Sale', icon: ShoppingBag, page: 'addSale', color: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { label: 'View Reports', icon: FileText, page: 'reports', color: 'bg-purple-100', textColor: 'text-purple-700' },
  ];

  const handleMenuClick = (page: any) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setCurrentPage(page);
  };

  return (
    <div className="p-4 space-y-6">
      <header className="animate-slide-up">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
        <p className="text-gray-500">Here's your business summary for today.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white animate-spring-in">
          <h2 className="text-lg font-semibold opacity-80">Total Outstanding Credit</h2>
          <p className="text-3xl font-bold">₹{totalOutstandingCredit.toLocaleString('en-IN')}</p>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-teal-400 text-white animate-spring-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-semibold opacity-80">Today’s Sale</h2>
          <p className="text-3xl font-bold">₹{todaysSale.toLocaleString('en-IN')}</p>
        </Card>
      </div>

      <Card 
        onClick={() => handleMenuClick('reminders')}
        className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white animate-spring-in cursor-pointer flex justify-between items-center" 
        style={{ animationDelay: '200ms' }}>
        <div className="flex items-center">
            <BellRing size={28} className="mr-3"/>
            <div>
                <h2 className="text-lg font-bold">Pending Reminders</h2>
                <p className="text-sm opacity-90">Overdue or Due Soon</p>
            </div>
        </div>
        <div className="text-3xl font-bold">{pendingRemindersCount}</div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => handleMenuClick(item.page as any)}
            className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center ${item.color} ${item.textColor} animate-spring-in`}
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            <item.icon size={32} className="mb-2" />
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;