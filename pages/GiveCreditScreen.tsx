import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { CreditEntry, Customer } from '../types';
import { ArrowLeft, Camera, Send } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import Spinner from '../components/Spinner';

const GiveCreditScreen: React.FC = () => {
  const { customers, addCreditEntry, setCurrentPage, addToast, user } = useApp();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsCompressing(true);
      try {
        const compressedPhoto = await compressImage(e.target.files[0]);
        setPhoto(compressedPhoto);
      } catch (error) {
        console.error("Failed to compress image:", error);
        addToast("Failed to process image. Please try another one.");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSave = (sendWhatsApp: boolean) => {
    if (!selectedCustomerId || !amount || !dueDate) {
        addToast("Please select a customer, enter an amount, and set a due date.");
        return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
        const newEntry: Omit<CreditEntry, 'id' | 'userId'> = {
            customerId: selectedCustomerId,
            amount: parseFloat(amount),
            note: notes,
            photoUrl: photo || undefined,
            dateTime: new Date().toISOString(),
            dueDate,
            status: 'unpaid'
        };
        addCreditEntry(newEntry);

        if(sendWhatsApp) {
            const customer = customers.find(c => c.id === selectedCustomerId);
            if(customer) {
                if(!photo && !window.confirm("Continue without a photo?")) {
                    setIsLoading(false);
                    return;
                }
                sendWhatsAppMessage(customer, newEntry);
                addToast('WhatsApp message ready. ✔');
            }
        } else {
            addToast('Credit entry saved. ✔');
        }
        
        setIsLoading(false);
        setCurrentPage('customerLedger', { customerId: selectedCustomerId });
    }, 500);
  };
  
  const sendWhatsAppMessage = (customer: Customer, entry: Omit<CreditEntry, 'id' | 'userId'>) => {
    const date = new Date(entry.dateTime).toLocaleDateString('en-IN');
    const time = new Date(entry.dateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dueDateFormatted = new Date(entry.dueDate).toLocaleDateString('en-IN');

    let message = `Hello ${customer.name},\n\n`;
    message += `This is a confirmation for your recent credit purchase:\n\n`;
    message += `Amount: ₹${entry.amount}\n`;
    message += `Date: ${date} | Time: ${time}\n`;
    message += `Due Date: ${dueDateFormatted}\n\n`;
    if(photo) {
        message += `A photo of the item/ledger is attached.\n\n`;
    }
    message += `Thank you.\n- Sent from *${user?.name || 'Your Shop'}*`;
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = customer.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };


  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('home')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Give Credit (Udhar)</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700">Select Customer</label>
          <select id="customer" value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" required>
            <option value="">-- Select a Customer --</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Upload Photo (Optional)</label>
          <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                  {isCompressing ? (
                      <Spinner />
                  ) : photo ? (
                      <img src={photo} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
                  ) : (
                      <Camera size={48} className="mx-auto text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>{photo ? 'Change photo' : 'Upload a file'}</span>
                          <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoUpload} disabled={isCompressing}/>
                      </label>
                  </div>
                  <p className="text-xs text-gray-500">{isCompressing ? "Compressing..." : "PNG, JPG up to 10MB"}</p>
              </div>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
            <button onClick={() => handleSave(false)} disabled={isLoading} className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center h-12 disabled:opacity-50">
                {isLoading ? <Spinner/> : 'SAVE'}
            </button>
            <button onClick={() => handleSave(true)} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center h-12 disabled:opacity-50">
                {isLoading ? <Spinner /> : <><Send size={18} className="mr-2"/> SAVE & SEND WHATSAPP</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default GiveCreditScreen;