
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In a real app, this would be a hash. Here it's stored as plain text.
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address?: string;
}

export type CreditEntryStatus = 'paid' | 'unpaid';

export interface CreditEntry {
  id: string;
  userId: string;
  customerId: string;
  amount: number;
  note?: string;
  photoUrl?: string; // base64 string
  dateTime: string;
  dueDate: string;
  status: CreditEntryStatus;
  datePaid?: string; // ISO string when payment was received
}

export type PaymentType = 'Cash' | 'UPI' | 'Online' | 'Card';

export interface SaleEntry {
  id: string;
  userId: string;
  productId?: string;
  item: string;
  qty: number;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  costOfGoodsSold: number;
  profit: number;
  paymentType: PaymentType;
  notes?: string;
  photoUrl?: string;
  dateTime: string;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  stockQty: number;
  sellingPrice: number; // Price before tax
  costPrice: number; // Purchase price before tax
  gstRate: number; // in percentage
}

export interface PurchaseEntry {
    id: string;
    userId: string;
    productId: string;
    qty: number;
    subtotal: number;
    gstAmount: number;
    totalAmount: number;
    dateTime: string;
    paymentStatus: 'paid' | 'unpaid';
    notes?: string;
}


export type Page = 
  | 'splash'
  | 'login'
  | 'signup'
  | 'home'
  | 'customers'
  | 'addCustomer'
  | 'giveCredit'
  | 'customerLedger'
  | 'addSale'
  | 'sales'
  | 'reports'
  | 'settings'
  | 'editProfile'
  | 'changePassword'
  | 'language'
  | 'backup'
  | 'inventory'
  | 'products'
  | 'addPurchase'
  | 'purchases'
  | 'reminders';