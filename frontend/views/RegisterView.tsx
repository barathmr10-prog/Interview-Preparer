import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/authService';

interface RegisterViewProps {
  onNavigate: (view: 'login' | 'home') => void;
  onRegisterSuccess: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Password validation rules
  const isLengthValid = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@#$%&*]/.test(password);
  const isPasswordValid = isLengthValid && hasLower && hasUpper && hasNumber && hasSpecial;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      registerUser(email, password, firstName, lastName);
      // Auto login after successful registration
      loginUser(email, password);
      onRegisterSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center py-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                placeholder="Last Name"
              />
            </div>
          </div>

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
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
              placeholder="Create a password"
            />
            
            {/* Password Requirements Info Box */}
            {(isPasswordFocused || password.length > 0) && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg text-xs border border-blue-100 transition-all">
                <p className="font-semibold text-blue-900 mb-1.5">Password must contain:</p>
                <ul className="space-y-1">
                  <li className={`flex items-center gap-1.5 ${isLengthValid ? 'text-green-600' : 'text-blue-700'}`}>
                    <span className="text-sm leading-none">{isLengthValid ? '✓' : '•'}</span> At least 8 characters
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasLower ? 'text-green-600' : 'text-blue-700'}`}>
                    <span className="text-sm leading-none">{hasLower ? '✓' : '•'}</span> One lowercase letter
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasUpper ? 'text-green-600' : 'text-blue-700'}`}>
                    <span className="text-sm leading-none">{hasUpper ? '✓' : '•'}</span> One uppercase letter
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasNumber ? 'text-green-600' : 'text-blue-700'}`}>
                    <span className="text-sm leading-none">{hasNumber ? '✓' : '•'}</span> One number
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasSpecial ? 'text-green-600' : 'text-blue-700'}`}>
                    <span className="text-sm leading-none">{hasSpecial ? '✓' : '•'}</span> One special character (@#$%&*)
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-xl sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-3 sm:py-2.5 rounded-xl sm:rounded-lg hover:bg-indigo-700 transition-colors active:bg-indigo-800 mt-2"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('login')}
            className="text-indigo-600 hover:text-indigo-800 font-medium p-2 -m-2"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
