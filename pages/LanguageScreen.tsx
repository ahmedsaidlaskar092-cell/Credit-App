import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Globe, ArrowLeft } from 'lucide-react';
import Card from '../components/Card';

const LanguageScreen: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('settings')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Language Settings</h1>
      </div>
      <Card className="text-center">
        <div className="flex justify-center mb-4">
            <Globe size={48} className="text-blue-500"/>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Coming Soon!</h2>
        <p className="text-gray-600 mt-2">
          Multi-language support is under development. The app is currently available in English.
        </p>
         <button
          onClick={() => setCurrentPage('settings')}
          className="mt-6 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Go Back
        </button>
      </Card>
    </div>
  );
};

export default LanguageScreen;