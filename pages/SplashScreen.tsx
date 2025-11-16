import React from 'react';
import { BookText, Repeat } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
      <div className="flex items-center justify-center text-blue-600 mb-4 animate-bounce-in">
        <BookText size={48} className="mr-2"/>
        <Repeat size={48} />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Simple Credit & Sale Tracker</h1>
        <p className="mt-2 text-lg text-gray-600">“Udhar + Sales, Sabka Hisaab Ek Jagah.”</p>
      </div>
    </div>
  );
};

export default SplashScreen;