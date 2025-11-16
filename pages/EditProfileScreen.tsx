import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { User, ArrowLeft } from 'lucide-react';
import Spinner from '../components/Spinner';

const EditProfileScreen: React.FC = () => {
  const { user, updateUser, setCurrentPage, addToast } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      addToast("Name and email cannot be empty.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      if (updateUser({ name, email })) {
        addToast('Profile updated successfully ✔');
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
        <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
                <User size={40} className="text-blue-600"/>
            </div>
        </div>
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="userName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">Email</label>
           <input
            id="userEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow flex items-center justify-center h-12 disabled:opacity-50"
        >
          {isLoading ? <Spinner /> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfileScreen;