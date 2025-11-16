import React, { createContext, useContext, useState, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User, Customer, CreditEntry, SaleEntry, Page, Product, PurchaseEntry } from '../types';

interface Toast {
  id: string;
  message: string;
}

interface AppContextType {
  // Navigation
  currentPage: Page;
  setCurrentPage: (page: Page, params?: any) => void;
  pageParams: any;

  // Auth
  user: User | null;
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<Omit<User, 'id' | 'passwordHash'>>) => boolean;
  changePassword: (currentPass: string, newPass: string) => boolean;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'userId'>) => void;
  getCustomerById: (id: string) => Customer | undefined;

  // Credit Entries
  creditEntries: CreditEntry[];
  addCreditEntry: (entry: Omit<CreditEntry, 'id' | 'userId'>) => void;
  updateCreditEntry: (id: string, updates: Partial<CreditEntry>) => void;
  getCreditEntriesByCustomerId: (customerId: string) => CreditEntry[];

  // Sale Entries
  saleEntries: SaleEntry[];
  addSaleEntry: (entry: Omit<SaleEntry, 'id' | 'userId' | 'costOfGoodsSold' | 'profit'>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'userId'>) => void;
  getProductById: (id: string) => Product | undefined;

  // Purchases
  purchaseEntries: PurchaseEntry[];
  addPurchaseEntry: (entry: Omit<PurchaseEntry, 'id' | 'userId'>) => void;
  updatePurchaseEntry: (id: string, updates: Partial<PurchaseEntry>) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, _setCurrentPage] = useState<Page>('home');
  const [pageParams, setPageParams] = useState<any>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [user, setUser] = useLocalStorage<User | null>('currentUser', null);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
  const [creditEntries, setCreditEntries] = useLocalStorage<CreditEntry[]>('credit_entries', []);
  const [saleEntries, setSaleEntries] = useLocalStorage<SaleEntry[]>('sale_entries', []);
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [purchaseEntries, setPurchaseEntries] = useLocalStorage<PurchaseEntry[]>('purchase_entries', []);
  
  const setCurrentPage = (page: Page, params: any = null) => {
    _setCurrentPage(page);
    setPageParams(params);
  };

  // Toast Logic
  const addToast = (message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  
  // Auth Logic
  const login = (email: string, pass: string): boolean => {
    const foundUser = users.find(u => u.email === email && u.passwordHash === pass);
    if (foundUser) {
      setUser(foundUser);
      setCurrentPage('home');
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, pass: string): boolean => {
    if (users.some(u => u.email === email)) {
      return false; // User already exists
    }
    const newUser: User = { id: Date.now().toString(), name, email, passwordHash: pass };
    setUsers([...users, newUser]);
    setUser(newUser);
    setCurrentPage('home');
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const updateUser = (updates: Partial<Omit<User, 'id' | 'passwordHash'>>): boolean => {
    if (!user) return false;

    if (updates.email && users.some(u => u.email === updates.email && u.id !== user.id)) {
        addToast("This email is already in use by another account.");
        return false;
    }
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? updatedUser : u));
    return true;
  };
  
  const changePassword = (currentPass: string, newPass: string): boolean => {
    if (!user || user.passwordHash !== currentPass) {
        addToast("Current password is incorrect.");
        return false;
    }
    const updatedUser = { ...user, passwordHash: newPass };
    setUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? updatedUser : u));
    return true;
  };

  // Customer Logic
  const addCustomer = (customerData: Omit<Customer, 'id' | 'userId'>) => {
    if (!user) return;
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      userId: user.id,
    };
    setCustomers(prev => [...prev, newCustomer]);
  };
  const getCustomerById = (id: string) => customers.find(c => c.id === id && c.userId === user?.id);

  // Credit Logic
  const addCreditEntry = (entryData: Omit<CreditEntry, 'id' | 'userId'>) => {
    if (!user) return;
    const newEntry: CreditEntry = {
      ...entryData,
      id: Date.now().toString(),
      userId: user.id,
    };
    setCreditEntries(prev => [...prev, newEntry]);
  };

  const updateCreditEntry = (id: string, updates: Partial<CreditEntry>) => {
    const finalUpdates = { ...updates };
    if (updates.status === 'paid' && !updates.datePaid) {
      const originalEntry = creditEntries.find(e => e.id === id);
      if(originalEntry && originalEntry.status === 'unpaid') {
        finalUpdates.datePaid = new Date().toISOString();
      }
    }
    setCreditEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...finalUpdates } : entry));
  };
  
  const getCreditEntriesByCustomerId = (customerId: string) => {
    return creditEntries.filter(e => e.customerId === customerId && e.userId === user?.id).sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  };

  // Sale Logic
  const addSaleEntry = (entryData: Omit<SaleEntry, 'id' | 'userId' | 'costOfGoodsSold' | 'profit'>) => {
    if (!user) return;

    let costOfGoodsSold = 0;
    let profit = 0;

    if (entryData.productId) {
      const product = getProductById(entryData.productId);
      if (product) {
        costOfGoodsSold = product.costPrice * entryData.qty;
        profit = entryData.subtotal - costOfGoodsSold;
        
        // Update product stock
        setProducts(prev => prev.map(p => 
          p.id === entryData.productId ? { ...p, stockQty: p.stockQty - entryData.qty } : p
        ));
      }
    }

    const newEntry: SaleEntry = {
      ...entryData,
      id: Date.now().toString(),
      userId: user.id,
      costOfGoodsSold,
      profit,
    };
    setSaleEntries(prev => [...prev, newEntry]);
  };

  // Product Logic
  const addProduct = (productData: Omit<Product, 'id' | 'userId'>) => {
    if (!user) return;
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      userId: user.id,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const getProductById = (id: string) => products.find(p => p.id === id && p.userId === user?.id);

  // Purchase Logic
  const addPurchaseEntry = (entryData: Omit<PurchaseEntry, 'id' | 'userId'>) => {
    if (!user) return;
    const newEntry: PurchaseEntry = {
        ...entryData,
        id: Date.now().toString(),
        userId: user.id,
    };
    setPurchaseEntries(prev => [...prev, newEntry]);
    
    const perItemCost = newEntry.subtotal / newEntry.qty;

    // Update product stock and cost price
    setProducts(prev => prev.map(p => 
        p.id === newEntry.productId ? { 
            ...p, 
            stockQty: p.stockQty + newEntry.qty,
            costPrice: perItemCost, // Update cost price to the latest purchase price
        } : p
    ));
  };

  const updatePurchaseEntry = (id: string, updates: Partial<PurchaseEntry>) => {
    setPurchaseEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...updates } : entry));
  };

  const value = {
    currentPage,
    setCurrentPage,
    pageParams,
    user,
    login,
    signup,
    logout,
    updateUser,
    changePassword,
    customers: customers.filter(c => c.userId === user?.id),
    addCustomer,
    getCustomerById,
    creditEntries: creditEntries.filter(ce => ce.userId === user?.id),
    addCreditEntry,
    updateCreditEntry,
    getCreditEntriesByCustomerId,
    saleEntries: saleEntries.filter(se => se.userId === user?.id),
    addSaleEntry,
    products: products.filter(p => p.userId === user?.id),
    addProduct,
    getProductById,
    purchaseEntries: purchaseEntries.filter(p => p.userId === user?.id),
    addPurchaseEntry,
    updatePurchaseEntry,
    toasts,
    addToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};