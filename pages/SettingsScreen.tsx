
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { User, Lock, Globe, Database, LogOut, ChevronRight } from 'lucide-react';

const SettingsScreen: React.FC = () => {
  const { user, logout, setCurrentPage } = useApp();

  const settingsOptions = [
    { icon: User, label: 'Edit Profile', action: () => setCurrentPage('editProfile') },
    { icon: Lock, label: 'Change Password', action: () => setCurrentPage('changePassword') },
    { icon: Globe, label: 'Language', action: () => setCurrentPage('language') },
    { icon: Database, label: 'Backup Info', action: () => setCurrentPage('backup') },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <User size={24} className="text-blue-600" />
        </div>
        <div>
          <p className="font-bold text-lg text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <ul className="divide-y divide-gray-200">
          {settingsOptions.map((option, index) => (
            <li key={index} onClick={option.action} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
              <div className="flex items-center">
                <option.icon className="text-gray-600 mr-4" size={22} />
                <span className="text-gray-700 font-medium">{option.label}</span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <button 
          onClick={logout}
          className="w-full bg-red-100 text-red-600 font-bold py-3 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;