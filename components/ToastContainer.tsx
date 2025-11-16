import React from 'react';
import { useApp } from '../contexts/AppContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useApp();

    return (
        <div className="fixed bottom-20 right-4 z-[100] space-y-2 md:bottom-4">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} onDismiss={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

export default ToastContainer;
