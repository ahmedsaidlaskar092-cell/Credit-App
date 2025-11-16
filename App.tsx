import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import HomeScreen from './pages/HomeScreen';
import AddCustomerScreen from './pages/AddCustomerScreen';
import CustomersScreen from './pages/CustomersScreen';
import GiveCreditScreen from './pages/GiveCreditScreen';
import CustomerLedgerScreen from './pages/CustomerLedgerScreen';
import AddSaleScreen from './pages/AddSaleScreen';
import SalesBookScreen from './pages/SalesBookScreen';
import ReportsScreen from './pages/ReportsScreen';
import SettingsScreen from './pages/SettingsScreen';
import EditProfileScreen from './pages/EditProfileScreen';
import ChangePasswordScreen from './pages/ChangePasswordScreen';
import LanguageScreen from './pages/LanguageScreen';
import BackupScreen from './pages/BackupScreen';
import Layout from './components/Layout';
import ToastContainer from './components/ToastContainer';
import InventoryScreen from './pages/InventoryScreen';
import ProductsScreen from './pages/ProductsScreen';
import AddPurchaseScreen from './pages/AddPurchaseScreen';
import PurchasesScreen from './pages/PurchasesScreen';
import RemindersScreen from './pages/RemindersScreen';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Main />
      <ToastContainer />
    </AppProvider>
  );
};

const Main: React.FC = () => {
  const { currentPage, pageParams, user } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  const renderPage = () => {
    if (!user) {
      switch (currentPage) {
        case 'signup':
          return <SignupScreen />;
        default:
          return <LoginScreen />;
      }
    }

    const pageComponent = () => {
        switch (currentPage) {
            case 'home': return <HomeScreen />;
            case 'customers': return <CustomersScreen />;
            case 'addCustomer': return <AddCustomerScreen />;
            case 'giveCredit': return <GiveCreditScreen />;
            case 'customerLedger': return <CustomerLedgerScreen customerId={pageParams?.customerId} />;
            case 'addSale': return <AddSaleScreen />;
            case 'sales': return <SalesBookScreen />;
            case 'reports': return <ReportsScreen />;
            case 'settings': return <SettingsScreen />;
            case 'editProfile': return <EditProfileScreen />;
            case 'changePassword': return <ChangePasswordScreen />;
            case 'language': return <LanguageScreen />;
            case 'backup': return <BackupScreen />;
            case 'inventory': return <InventoryScreen />;
            case 'products': return <ProductsScreen />;
            case 'addPurchase': return <AddPurchaseScreen />;
            case 'purchases': return <PurchasesScreen />;
            case 'reminders': return <RemindersScreen />;
            default: return <HomeScreen />;
        }
    };

    return <Layout>{pageComponent()}</Layout>;
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
       <div key={currentPage} className="animate-fade-in">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
