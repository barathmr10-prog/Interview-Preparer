import React, { useState, useEffect } from 'react';
import HomeView from './views/HomeView';
import SavedView from './views/SavedView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import { ViewState, User } from './types';
import { getCurrentUser, logoutUser } from './services/authService';
import { UserIcon, HomeIcon, LibraryIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Handle routing and authentication checks
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ViewState;
      const user = getCurrentUser();
      setCurrentUser(user);

      if (!user) {
        // If not logged in, restrict to login or register
        if (hash === 'register') {
          setCurrentView('register');
        } else {
          setCurrentView('login');
          if (window.location.hash !== '#login') {
            window.location.hash = 'login';
          }
        }
      } else {
        // If logged in, restrict from login/register pages
        if (hash === 'login' || hash === 'register' || !hash) {
          window.location.hash = 'home';
          setCurrentView('home');
        } else if (hash === 'saved') {
          setCurrentView('saved');
        } else {
          setCurrentView('home');
        }
      }
    };

    // Set initial view based on hash and auth state
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: ViewState) => {
    window.location.hash = view;
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsProfileOpen(false);
    navigateTo('login');
  };

  return (
    // Use 100dvh for mobile browsers to account for dynamic address bars
    <div className="h-[100dvh] flex flex-col bg-gray-50 overflow-hidden">
      {/* Header Navigation - Fixed at top */}
      <header className="bg-white shadow-sm z-20 shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 sm:p-2 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">Ask & Save</h1>
            </div>
            
            {currentUser && (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Desktop Navigation (Hidden on mobile) */}
                <nav className="hidden sm:flex space-x-4">
                  <button
                    onClick={() => navigateTo('home')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'home'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => navigateTo('saved')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'saved'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Library
                  </button>
                </nav>
                
                {/* Profile Dropdown */}
                <div className="relative sm:border-l sm:border-gray-200 sm:pl-4">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    title="Profile"
                  >
                    <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {isProfileOpen && (
                    <>
                      {/* Invisible overlay to close dropdown when clicking outside */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsProfileOpen(false)}
                      ></div>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {currentUser.firstName} {currentUser.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {currentUser.email}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="max-w-5xl mx-auto w-full px-4 py-6 pb-24 sm:pb-8 min-h-full flex flex-col">
          {currentView === 'login' && (
            <LoginView 
              onNavigate={navigateTo} 
              onLoginSuccess={() => navigateTo('home')} 
            />
          )}
          {currentView === 'register' && (
            <RegisterView 
              onNavigate={navigateTo} 
              onRegisterSuccess={() => navigateTo('home')} 
            />
          )}
          {currentView === 'home' && currentUser && (
            <HomeView currentUser={currentUser} />
          )}
          {currentView === 'saved' && currentUser && (
            <SavedView currentUser={currentUser} />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {currentUser && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-around items-center h-16">
            <button 
              onClick={() => navigateTo('home')} 
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                currentView === 'home' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-[10px] mt-1 font-medium">Home</span>
            </button>
            <button 
              onClick={() => navigateTo('saved')} 
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                currentView === 'saved' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LibraryIcon className="w-6 h-6" />
              <span className="text-[10px] mt-1 font-medium">Library</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
