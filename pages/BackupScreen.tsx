import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Database, ArrowLeft, Download } from 'lucide-react';
import Card from '../components/Card';

const BackupScreen: React.FC = () => {
  const { setCurrentPage, addToast, customers, creditEntries, saleEntries, user } = useApp();

  const handleDownloadBackup = () => {
    const backupData = {
      userInfo: {
        name: user?.name,
        email: user?.email,
      },
      customers,
      creditEntries,
      saleEntries,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupData, null, 2)
    )}`;
    
    const link = document.createElement("a");
    link.href = jsonString;
    const date = new Date().toISOString().split('T')[0];
    link.download = `backup-${date}.json`;
    link.click();

    addToast('Backup downloaded successfully ✔');
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('settings')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Backup Information</h1>
      </div>
      <Card>
        <div className="flex flex-col items-center text-center">
          <Database size={48} className="text-blue-500 mb-4"/>
          <h2 className="text-xl font-semibold text-gray-800">Your Data, Your Control</h2>
          <p className="text-gray-600 mt-2 mb-6">
            Download a complete backup of all your customers, credit entries, and sales data in a single JSON file. Keep it safe for your records.
          </p>
          <button
            onClick={handleDownloadBackup}
            className="w-full max-w-xs bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow flex items-center justify-center"
          >
            <Download size={20} className="mr-2" />
            Download Backup
          </button>
        </div>
      </Card>
    </div>
  );
};

export default BackupScreen;