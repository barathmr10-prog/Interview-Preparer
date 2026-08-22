import React, { useState } from 'react';
import { loginUser } from '../services/authService';

interface LoginViewProps {
  onNavigate: (view: 'register' | 'home') => void;
  onLoginSuccess: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      loginUser(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center py-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide">WELCOME</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-3 sm:py-2.5 rounded-xl sm:rounded-lg hover:bg-indigo-700 transition-colors active:bg-indigo-800"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={() => onNavigate('register')}
            className="text-indigo-600 hover:text-indigo-800 font-medium p-2 -m-2"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
