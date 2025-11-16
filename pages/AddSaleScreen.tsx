
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { PaymentType, SaleEntry, Product } from '../types';
import { ArrowLeft, Camera, Plus, Minus } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import Spinner from '../components/Spinner';

const AddSaleScreen: React.FC = () => {
  const { products, addSaleEntry, setCurrentPage, addToast } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [qty, setQty] = useState('1');
  const [calculatedAmounts, setCalculatedAmounts] = useState({ subtotal: 0, gstAmount: 0, totalAmount: 0 });
  const [paymentType, setPaymentType] = useState<PaymentType>('Cash');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  useEffect(() => {
    if (selectedProduct) {
      const quantity = parseInt(qty, 10);
      if (!isNaN(quantity) && quantity > 0) {
        const subtotal = selectedProduct.sellingPrice * quantity;
        const gstAmount = subtotal * (selectedProduct.gstRate / 100);
        const totalAmount = subtotal + gstAmount;
        setCalculatedAmounts({ subtotal, gstAmount, totalAmount });
      } else {
        setCalculatedAmounts({ subtotal: 0, gstAmount: 0, totalAmount: 0 });
      }
    } else {
      setCalculatedAmounts({ subtotal: 0, gstAmount: 0, totalAmount: 0 });
    }
  }, [selectedProductId, qty, products]);


  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setIsCompressing(true);
        try {
            const compressedPhoto = await compressImage(e.target.files[0]);
            setPhoto(compressedPhoto);
        } catch (error) {
            console.error("Failed to compress image:", error);
            addToast("Failed to process image.");
        } finally {
            setIsCompressing(false);
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseInt(qty, 10);

    if (!selectedProductId || !selectedProduct || !qty || calculatedAmounts.totalAmount <= 0) {
        addToast("Please select a product and ensure all fields are filled correctly.");
        return;
    }

    if (quantity > selectedProduct.stockQty) {
        addToast(`Not enough stock. Only ${selectedProduct.stockQty} units available.`);
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
        // FIX: The type of newSale was incorrect, causing a TypeScript error. 
        // It's been updated to match what addSaleEntry expects, which calculates costOfGoodsSold and profit internally.
        const newSale: Omit<SaleEntry, 'id' | 'userId' | 'costOfGoodsSold' | 'profit'> = {
            productId: selectedProductId,
            item: selectedProduct.name,
            qty: quantity,
            subtotal: calculatedAmounts.subtotal,
            gstAmount: calculatedAmounts.gstAmount,
            totalAmount: calculatedAmounts.totalAmount,
            paymentType,
            notes,
            photoUrl: photo || undefined,
            dateTime: new Date().toISOString()
        };
        addSaleEntry(newSale);
        addToast('Sale entry added successfully ✔');
        setIsLoading(false);
        setCurrentPage('sales');
    }, 300);
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
        setQty(value);
    }
  };

  const handleQtyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
        setQty('1');
    }
  };

  const incrementQty = () => {
    setQty(prev => String((parseInt(prev, 10) || 0) + 1));
  };

  const decrementQty = () => {
    setQty(prev => String(Math.max(1, (parseInt(prev, 10) || 1) - 1)));
  };


  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('home')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add Sale</h1>
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
                {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQty})</option>
                ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <div className="flex items-center relative">
            <button
              type="button"
              onClick={decrementQty}
              className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none"
              aria-label="Decrement quantity"
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <input
              id="quantity"
              type="number"
              value={qty}
              onChange={handleQtyChange}
              onBlur={handleQtyBlur}
              className="w-full text-center border-t border-b border-gray-300 p-2 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 z-10"
              required
              min="1"
            />
            <button
              type="button"
              onClick={incrementQty}
              className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none"
              aria-label="Increment quantity"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
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
          <label className="block text-sm font-medium text-gray-700">Payment Type</label>
          <select value={paymentType} onChange={e => setPaymentType(e.target.value as PaymentType)} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option>Cash</option>
            <option>UPI</option>
            <option>Online</option>
            <option>Card</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
          <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Photo (Optional)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                  {isCompressing ? (
                      <Spinner />
                  ) : photo ? (
                      <img src={photo} alt="Sale preview" className="my-2 rounded-md max-h-32 mx-auto"/>
                  ) : (
                      <Camera size={48} className="mx-auto text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>{photo ? 'Change photo' : 'Upload a photo'}</span>
                          <input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoUpload} disabled={isCompressing}/>
                      </label>
                  </div>
                   <p className="text-xs text-gray-500">{isCompressing ? "Compressing..." : "PNG, JPG up to 10MB"}</p>
              </div>
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center h-12 disabled:opacity-50">
            {isLoading ? <Spinner /> : 'Save Sale'}
        </button>
      </form>
    </div>
  );
};

export default AddSaleScreen;