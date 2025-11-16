import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { CreditEntry } from '../types';
import { Customer } from '../types';
import { useApp } from '../contexts/AppContext';

interface ReminderModalProps {
  entry: CreditEntry;
  customer: Customer;
  onClose: () => void;
}

type Tone = 'Polite' | 'Humble' | 'Hard';

const ReminderModal: React.FC<ReminderModalProps> = ({ entry, customer, onClose }) => {
  const [tone, setTone] = useState<Tone>('Polite');
  const { addToast, user } = useApp();

  const getMessage = (selectedTone: Tone) => {
    const dueDate = new Date(entry.dueDate).toLocaleDateString('en-IN');
    let baseMessage = '';
    switch (selectedTone) {
      case 'Polite':
        baseMessage = `Hello ${customer.name},\nThis is a friendly reminder regarding your pending payment of ₹${entry.amount}, which is due on ${dueDate}.\nPlease process the payment at your earliest convenience. Thank you.`;
        break;
      case 'Humble':
        baseMessage = `Hi ${customer.name},\nThis is a gentle reminder that your payment of ₹${entry.amount} is approaching its due date of ${dueDate}. We would appreciate it if you could clear it soon. Thank you.`;
        break;
      case 'Hard':
        baseMessage = `URGENT REMINDER: Your payment of ₹${entry.amount} is overdue. The due date was ${dueDate}.\nPlease clear the outstanding amount immediately to avoid any inconvenience.`;
        break;
      default:
        baseMessage = '';
    }
    return `${baseMessage}\n\n- Sent from *${user?.name || 'Your Shop'}*`;
  };

  const message = useMemo(() => getMessage(tone), [tone, entry, customer, user]);

  const sendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = customer.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    addToast('Reminder sent to customer ✔');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-scale">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Choose Reminder Tone</h2>
        <div className="flex justify-around mb-6">
          {(['Polite', 'Humble', 'Hard'] as Tone[]).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tone === t ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2 text-gray-700">Message Preview:</h3>
          <div className="bg-gray-100 p-4 rounded-md border border-gray-200 whitespace-pre-wrap text-sm text-gray-800">
            {message}
          </div>
        </div>
        <button
          onClick={sendWhatsApp}
          className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center shadow-lg"
        >
          Send via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ReminderModal;