import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Spinner from '../components/Spinner';

const AddCustomerScreen: React.FC = () => {
  const { addCustomer, setCurrentPage, addToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      if (phone.length !== 10) {
        addToast('Please enter a valid 10-digit phone number.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        addCustomer({ name, phone: `+91${phone}`, address });
        addToast('Customer added successfully ✔');
        setIsLoading(false);
        setCurrentPage('customers');
      }, 300);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('home')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Customer</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
                <UserPlus size={40} className="text-blue-600"/>
            </div>
        </div>
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            id="customerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              +91
            </span>
            <input
              id="phoneNumber"
              type="tel"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  setPhone(value);
                }
              }}
              placeholder="9876543210"
              className="flex-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-r-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              pattern="\d{10}"
              title="Please enter a 10-digit phone number"
            />
          </div>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address (Optional)</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow flex items-center justify-center h-12 disabled:opacity-50"
        >
          {isLoading ? <Spinner /> : 'Save Customer'}
        </button>
      </form>
    </div>
  );
};

export default AddCustomerScreen;