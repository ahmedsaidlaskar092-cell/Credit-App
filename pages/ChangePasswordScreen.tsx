import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Lock, ArrowLeft } from 'lucide-react';
import Spinner from '../components/Spinner';

const ChangePasswordScreen: React.FC = () => {
  const { changePassword, setCurrentPage, addToast } = useApp();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      addToast("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      if (changePassword(currentPassword, newPassword)) {
        addToast('Password changed successfully ✔');
        setCurrentPage('settings');
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentPage('settings')} className="p-2 mr-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <Lock size={40} className="text-blue-600"/>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow flex items-center justify-center h-12 disabled:opacity-50"
        >
          {isLoading ? <Spinner /> : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordScreen;