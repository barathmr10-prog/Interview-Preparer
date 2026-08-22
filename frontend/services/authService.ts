import { User } from '../types';

// Simulating a SQL database table for users
const SQL_USERS_TABLE_KEY = 'ask_and_save_users_table';
const CURRENT_SESSION_KEY = 'ask_and_save_session';

let inMemoryUsers: any[] = [];
let inMemorySession: User | null = null;
let isStorageAvailable = true;

try {
  const testKey = '__test_auth__';
  localStorage.setItem(testKey, testKey);
  localStorage.removeItem(testKey);
} catch (e) {
  isStorageAvailable = false;
}

const getUsersTable = (): any[] => {
  if (!isStorageAvailable) return inMemoryUsers;
  const data = localStorage.getItem(SQL_USERS_TABLE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveUsersTable = (users: any[]) => {
  if (!isStorageAvailable) {
    inMemoryUsers = users;
    return;
  }
  localStorage.setItem(SQL_USERS_TABLE_KEY, JSON.stringify(users));
};

export const registerUser = (email: string, password: string, firstName: string, lastName: string): User => {
  const users = getUsersTable();
  
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already exists.");
  }

  const newUser = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
    email,
    password, // In a real SQL DB, this would be hashed (e.g., bcrypt)
    firstName,
    lastName
  };

  users.push(newUser);
  saveUsersTable(users);

  const userToReturn = { 
    id: newUser.id, 
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName
  };
  return userToReturn;
};

export const loginUser = (email: string, password: string): User => {
  const users = getUsersTable();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const sessionUser = { 
    id: user.id, 
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };
  
  if (isStorageAvailable) {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
  } else {
    inMemorySession = sessionUser;
  }

  return sessionUser;
};

export const logoutUser = (): void => {
  if (isStorageAvailable) {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } else {
    inMemorySession = null;
  }
};

export const getCurrentUser = (): User | null => {
  if (!isStorageAvailable) return inMemorySession;
  const data = localStorage.getItem(CURRENT_SESSION_KEY);
  return data ? JSON.parse(data) : null;
};
