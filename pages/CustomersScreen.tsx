
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { User, ChevronRight, Search } from 'lucide-react';
import Card from '../components/Card';

const CustomersScreen: React.FC = () => {
  const { customers, setCurrentPage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) {
      return customers;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowercasedTerm) ||
      customer.phone.includes(lowercasedTerm)
    );
  }, [customers, searchTerm]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <button 
            onClick={() => setCurrentPage('addCustomer')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
            Add New
        </button>
      </div>

      <div className="mb-6 relative">
        <input 
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {filteredCustomers.length === 0 ? (
        <Card className="text-center">
            <p className="text-gray-500">{customers.length === 0 ? "You haven't added any customers yet." : "No customers match your search."}</p>
            {customers.length === 0 && <button onClick={() => setCurrentPage('addCustomer')} className="mt-4 text-blue-600 font-semibold">Add your first customer</button>}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              onClick={() => setCurrentPage('customerLedger', { customerId: customer.id })}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-3 rounded-full mr-4">
                  <User size={24} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.phone}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersScreen;
