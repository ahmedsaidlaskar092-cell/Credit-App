import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { X, Package } from 'lucide-react';
import Spinner from './Spinner';

interface ProductFormModalProps {
  onClose: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ onClose }) => {
  const { addProduct, addToast } = useApp();
  const [name, setName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stockQty, setStockQty] = useState('0');
  const [gstRate, setGstRate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sellingPrice || !gstRate || !costPrice) {
      addToast('Please fill all required fields.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      addProduct({
        name,
        sellingPrice: parseFloat(sellingPrice),
        costPrice: parseFloat(costPrice),
        stockQty: parseInt(stockQty, 10) || 0,
        gstRate: parseFloat(gstRate) || 0,
      });
      addToast('Product added successfully ✔');
      setIsLoading(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-scale">
        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
          <div className="flex items-center mb-4">
            <Package className="text-blue-500 mr-2" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                id="productName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">Purchase Price (excl. Tax)</label>
                <input
                  id="costPrice"
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">Selling Price (excl. Tax)</label>
                <input
                  id="sellingPrice"
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                <label htmlFor="gstRate" className="block text-sm font-medium text-gray-700">GST Rate (%)</label>
                <input
                  id="gstRate"
                  type="number"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="initialStock" className="block text-sm font-medium text-gray-700">Initial Stock</label>
                <input
                  id="initialStock"
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center h-12 disabled:opacity-50"
            >
              {isLoading ? <Spinner /> : 'Save Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;