import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 1800);

    const dismissTimer = setTimeout(() => {
      onDismiss();
    }, 2100); // Corresponds to animation duration

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);
  
  return (
    <div className={`flex items-center bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}>
      <CheckCircle className="mr-2" size={20} />
      <span className="font-semibold">{message}</span>
    </div>
  );
};

export default Toast;
