import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import ReminderModal from '../components/ReminderModal';
import { CreditEntry } from '../types';

interface CustomerLedgerScreenProps {
  customerId?: string;
}

const CustomerLedgerScreen: React.FC<CustomerLedgerScreenProps> = ({ customerId }) => {
  const { getCustomerById, getCreditEntriesByCustomerId, updateCreditEntry, setCurrentPage, addToast } = useApp();
  const [reminderEntry, setReminderEntry] = useState<CreditEntry | null>(null);

  const customer = useMemo(() => customerId ? getCustomerById(customerId) : undefined, [customerId, getCustomerById]);
  const entries = useMemo(() => customerId ? getCreditEntriesByCustomerId(customerId) : [], [customerId, getCreditEntriesByCustomerId]);
  
  const totalOutstanding = useMemo(() => {
    return entries.filter(e => e.status === 'unpaid').reduce((sum, e) => sum + e.amount, 0);
  }, [entries]);

  const handleMarkAsPaid = (entryId: string) => {
    updateCreditEntry(entryId, { status: 'paid' });
    addToast('Payment updated ✔');
  };

  if (!customer) {
    return <div className="p-4 text-center text-red-500">Customer not found.</div>;
  }
  
  const getReminderStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} day(s)`, color: "text-red-500 font-bold" };
    if (diffDays === 0) return { text: "Due Today", color: "text-orange-500 font-semibold" };
    if (diffDays <= 3) return { text: `Due in ${diffDays} day(s)`, color: "text-yellow-600" };
    return { text: '', color: '' };
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button onClick={() => setCurrentPage('customers')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
            <p className="text-sm text-gray-500">{customer.phone}</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6 text-center">
        <h2 className="text-lg font-semibold text-gray-600">Total Outstanding</h2>
        <p className="text-4xl font-bold text-red-600">₹{totalOutstanding.toLocaleString('en-IN')}</p>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Entries</h3>
      <div className="space-y-4">
        {entries.length > 0 ? entries.map((entry, index) => (
          <div 
            key={entry.id} 
            className="bg-white p-4 rounded-lg shadow-sm animate-slide-up"
            style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-2xl font-bold ${entry.status === 'paid' ? 'text-green-600' : 'text-gray-800'}`}>₹{entry.amount.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500">
                  {new Date(entry.dateTime).toLocaleString('en-IN')}
                </p>
                {entry.note && <p className="text-sm text-gray-600 mt-1 italic">"{entry.note}"</p>}
              </div>
              <div className={`px-3 py-1 text-sm rounded-full font-semibold ${entry.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {entry.status}
              </div>
            </div>
            
            {entry.photoUrl && <img src={entry.photoUrl} alt="Entry photo" className="mt-3 rounded-md max-h-40 w-auto" />}

            <div className="border-t my-3"></div>

            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    <p>Due: {new Date(entry.dueDate).toLocaleDateString('en-IN')}</p>
                    {entry.status === 'unpaid' && <p className={getReminderStatus(entry.dueDate).color}>{getReminderStatus(entry.dueDate).text}</p>}
                </div>
                {entry.status === 'unpaid' && (
                  <div className="flex space-x-2">
                    <button onClick={() => setReminderEntry(entry)} className="p-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors">
                        <MessageSquare size={20} />
                    </button>
                    <button onClick={() => handleMarkAsPaid(entry.id)} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
                        <CheckCircle size={20} />
                    </button>
                  </div>
                )}
            </div>
          </div>
        )) : <p className="text-center text-gray-500">No credit entries for this customer yet.</p>}
      </div>

      {reminderEntry && (
        <ReminderModal entry={reminderEntry} customer={customer} onClose={() => setReminderEntry(null)} />
      )}
    </div>
  );
};

export default CustomerLedgerScreen;