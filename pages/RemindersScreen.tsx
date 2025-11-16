import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, MessageSquare, BellRing } from 'lucide-react';
import ReminderModal from '../components/ReminderModal';
import { CreditEntry } from '../types';
import Card from '../components/Card';

const RemindersScreen: React.FC = () => {
  const { creditEntries, getCustomerById, setCurrentPage } = useApp();
  const [reminderEntry, setReminderEntry] = useState<CreditEntry | null>(null);

  const pendingReminders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return creditEntries
      .filter(e => e.status === 'unpaid')
      .map(entry => {
        const dueDate = new Date(entry.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...entry, diffDays };
      })
      .filter(entry => entry.diffDays <= 3) // Overdue or due within 3 days
      .sort((a, b) => a.diffDays - b.diffDays);
  }, [creditEntries]);

  const getReminderStatus = (diffDays: number) => {
    if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} day(s)`, color: "text-red-500 font-bold" };
    if (diffDays === 0) return { text: "Due Today", color: "text-orange-500 font-semibold" };
    return { text: `Due in ${diffDays} day(s)`, color: "text-yellow-600" };
  };

  const customerForEntry = reminderEntry ? getCustomerById(reminderEntry.customerId) : null;

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('home')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Pending Reminders</h1>
      </div>

      <div className="space-y-4">
        {pendingReminders.length > 0 ? pendingReminders.map(entry => {
          const customer = getCustomerById(entry.customerId);
          if (!customer) return null;
          const status = getReminderStatus(entry.diffDays);

          return (
            <Card key={entry.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{customer.name}</p>
                <p className="text-lg font-bold text-gray-700">₹{entry.amount.toLocaleString('en-IN')}</p>
                <p className={`text-sm ${status.color}`}>{status.text}</p>
              </div>
              <button
                onClick={() => setReminderEntry(entry)}
                className="p-3 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
              >
                <MessageSquare size={22} />
              </button>
            </Card>
          );
        }) : (
          <Card className="text-center">
            <BellRing size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">All Clear!</h2>
            <p className="text-gray-600 mt-2">
              You have no payments that are overdue or due soon.
            </p>
          </Card>
        )}
      </div>

      {reminderEntry && customerForEntry && (
        <ReminderModal entry={reminderEntry} customer={customerForEntry} onClose={() => setReminderEntry(null)} />
      )}
    </div>
  );
};

export default RemindersScreen;
