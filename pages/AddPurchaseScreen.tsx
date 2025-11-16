
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { PurchaseEntry } from '../types';
import { ArrowLeft } from 'lucide-react';
import Spinner from '../components/Spinner';

const AddPurchaseScreen: React.FC = () => {
  const { products, addPurchaseEntry, setCurrentPage, addToast } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [qty, setQty] = useState('');
  const [itemPriceExclGst, setItemPriceExclGst] = useState('');
  const [calculatedAmounts, setCalculatedAmounts] = useState({ subtotal: 0, gstAmount: 0, totalAmount: 0 });
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('paid');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const selectedProduct = products.find(p => p.id === selectedProductId);

  useEffect(() => {
    if (selectedProduct && qty && itemPriceExclGst) {
        const quantity = parseInt(qty, 10);
        const price = parseFloat(itemPriceExclGst);
        if (!isNaN(quantity) && !isNaN(price) && quantity > 0 && price >= 0) {
            const subtotal = price * quantity;
            const gstAmount = subtotal * (selectedProduct.gstRate / 100);
            const totalAmount = subtotal + gstAmount;
            setCalculatedAmounts({ subtotal, gstAmount, totalAmount });
        } else {
             setCalculatedAmounts({ subtotal: 0, gstAmount: 0, totalAmount: 0 });
        }
    } else {
        setCalculatedAmounts({ subtotal: 0, gstAmount: 0, totalAmount: 0 });
    }
}, [selectedProductId, qty, itemPriceExclGst, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !qty || !itemPriceExclGst || calculatedAmounts.totalAmount <= 0) {
      addToast('Please fill all fields correctly.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const newPurchase: Omit<PurchaseEntry, 'id' | 'userId'> = {
        productId: selectedProductId,
        qty: parseInt(qty, 10),
        subtotal: calculatedAmounts.subtotal,
        gstAmount: calculatedAmounts.gstAmount,
        totalAmount: calculatedAmounts.totalAmount,
        dateTime: new Date().toISOString(),
        paymentStatus: paymentStatus,
        notes: notes || undefined,
      };
      addPurchaseEntry(newPurchase);
      addToast('Purchase recorded successfully ✔');
      setIsLoading(false);
      setCurrentPage('purchases');
    }, 300);
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('inventory')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add Purchase</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product</label>
          <select 
            id="product" 
            value={selectedProductId} 
            onChange={e => setSelectedProductId(e.target.value)} 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
            required>
            <option value="">-- Select a Product --</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
              <input id="quantity" type="number" value={qty} onChange={e => setQty(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required min="1" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price / item (excl. Tax)</label>
              <input id="price" type="number" value={itemPriceExclGst} onChange={e => setItemPriceExclGst(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required min="0" />
            </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{calculatedAmounts.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
                <span>GST ({selectedProduct?.gstRate || 0}%)</span>
                <span>₹{calculatedAmounts.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="border-t border-gray-300 my-1"></div>
            <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total Amount</span>
                <span>₹{calculatedAmounts.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        </div>
        <div>
          <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">Payment Status</label>
          <select 
            id="paymentStatus" 
            value={paymentStatus} 
            onChange={e => setPaymentStatus(e.target.value as 'paid' | 'unpaid')}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
            required>
            <option value="paid">Paid (Cash/Online)</option>
            <option value="unpaid">Unpaid (Credit)</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., Supplier name, bill number"
          />
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center h-12 disabled:opacity-50">
          {isLoading ? <Spinner /> : 'Save Purchase'}
        </button>
      </form>
    </div>
  );
};

export default AddPurchaseScreen;