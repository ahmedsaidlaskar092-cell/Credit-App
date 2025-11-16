
import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react';
import Card from '../components/Card';

const PurchasesScreen: React.FC = () => {
  const { purchaseEntries, getProductById, setCurrentPage, updatePurchaseEntry, addToast } = useApp();

  const sortedPurchases = useMemo(() => {
    return [...purchaseEntries].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [purchaseEntries]);

  const handleMarkAsPaid = (purchaseId: string) => {
    updatePurchaseEntry(purchaseId, { paymentStatus: 'paid' });
    addToast('Purchase marked as paid ✔');
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('inventory')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Purchase History</h1>
      </div>
      
      <div className="space-y-3">
        {sortedPurchases.length === 0 ? (
          <Card className="text-center">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No purchases recorded yet.</p>
            <button onClick={() => setCurrentPage('addPurchase')} className="mt-4 text-blue-600 font-semibold">
              Record your first purchase
            </button>
          </Card>
        ) : sortedPurchases.map(purchase => {
          const product = getProductById(purchase.productId);
          const isUnpaid = purchase.paymentStatus === 'unpaid';
          return (
            <Card key={purchase.id}>
              <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{product?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-gray-500">Qty: {purchase.qty}</p>
                    {purchase.notes && <p className="text-sm text-gray-600 mt-1 italic">"{purchase.notes}"</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(purchase.dateTime).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-bold text-lg text-green-600">₹{purchase.totalAmount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500">Sub: ₹{purchase.subtotal.toLocaleString('en-IN')} + GST: ₹{purchase.gstAmount.toLocaleString('en-IN')}</p>
                    <span className={`mt-1 px-2 py-1 text-xs rounded-full font-semibold ${
                      isUnpaid ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {isUnpaid ? 'Unpaid' : 'Paid'}
                    </span>
                  </div>
              </div>
              {isUnpaid && (
                  <>
                    <div className="border-t my-3"></div>
                    <button 
                      onClick={() => handleMarkAsPaid(purchase.id)}
                      className="w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
                    >
                      <CheckCircle size={16} className="mr-2" /> Mark as Paid
                    </button>
                  </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PurchasesScreen;