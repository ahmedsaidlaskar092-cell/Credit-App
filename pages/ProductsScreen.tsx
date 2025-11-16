import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Package, Plus, ArrowLeft, Search } from 'lucide-react';
import Card from '../components/Card';
import ProductFormModal from '../components/ProductFormModal';

const ProductsScreen: React.FC = () => {
  const { products, setCurrentPage } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        if (stockFilter === 'inStock') return product.stockQty > 0;
        if (stockFilter === 'outOfStock') return product.stockQty === 0;
        return true;
      })
      .filter(product => {
        if (!searchTerm) return true;
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [products, searchTerm, stockFilter]);

  const filterOptions: {label: string, value: 'all' | 'inStock' | 'outOfStock'}[] = [
      { label: 'All', value: 'all' },
      { label: 'In Stock', value: 'inStock' },
      { label: 'Out of Stock', value: 'outOfStock' }
  ];

  return (
    <div className="p-4 relative min-h-[calc(100vh-5rem)]">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('inventory')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex justify-center space-x-2">
            {filterOptions.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => setStockFilter(opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        stockFilter === opt.value ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">You haven't added any products yet.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 text-blue-600 font-semibold">
            Add your first product
          </button>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card className="text-center">
          <p className="text-gray-500">No products match your search or filter.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map(product => (
            <Card key={product.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Package size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">Price: ₹{product.sellingPrice.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${product.stockQty > 0 ? 'text-gray-700' : 'text-red-500'}`}>{product.stockQty}</p>
                <p className="text-xs text-gray-500">In Stock</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
        aria-label="Add new product"
      >
        <Plus size={28} />
      </button>

      {isModalOpen && <ProductFormModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ProductsScreen;