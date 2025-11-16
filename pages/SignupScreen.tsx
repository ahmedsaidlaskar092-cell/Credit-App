import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserPlus } from 'lucide-react';
import Spinner from '../components/Spinner';

const SignupScreen: React.FC = () => {
  const { signup, setCurrentPage } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
        if (!signup(name, email, password)) {
          setError('An account with this email already exists.');
        }
        setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8 animate-fade-in-scale">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mb-3 animate-bounce-in">
            <UserPlus className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500">Join us today!</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">Confirm Password</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300 flex items-center justify-center h-10 disabled:opacity-50 animate-slide-up" style={{ animationDelay: '500ms' }}>
            {isLoading ? <Spinner size="sm" /> : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
          Already have an account?{' '}
          <button onClick={() => setCurrentPage('login')} className="font-bold text-blue-600 hover:text-blue-800">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;