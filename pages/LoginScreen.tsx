import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { LogIn } from 'lucide-react';
import Spinner from '../components/Spinner';

const LoginScreen: React.FC = () => {
  const { login, setCurrentPage } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
        if (!login(email, password)) {
          setError('Invalid email or password.');
        }
        setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8 animate-fade-in-scale">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mb-3 animate-bounce-in">
            <LogIn className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500">Log in to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <div className="mb-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '300ms' }}>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300 flex items-center justify-center h-10 disabled:opacity-50"
            >
              {isLoading ? <Spinner size="sm" /> : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => { /* Forgot password logic */ }}
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mt-4"
            >
              Forgot Password?
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
          Don't have an account?{' '}
          <button onClick={() => setCurrentPage('signup')} className="font-bold text-blue-600 hover:text-blue-800">
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;