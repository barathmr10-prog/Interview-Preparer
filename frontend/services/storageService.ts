import { QAItem } from '../types';

const STORAGE_KEY = 'interview_prep_saved_qa';

// Fallback for environments where localStorage is restricted (e.g., sandboxed iframes)
let inMemoryFallback: QAItem[] = [];
let isLocalStorageAvailable = true;

try {
  const testKey = '__test_storage__';
  localStorage.setItem(testKey, testKey);
  localStorage.removeItem(testKey);
} catch (e) {
  console.warn('localStorage is not available. Using in-memory storage fallback.');
  isLocalStorageAvailable = false;
}

const getAllItems = (): QAItem[] => {
  if (!isLocalStorageAvailable) {
    return [...inMemoryFallback];
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading from local storage", error);
    return [...inMemoryFallback];
  }
};

export const getSavedItems = (userId: string): QAItem[] => {
  const allItems = getAllItems();
  return allItems.filter(item => item.userId === userId);
};

export const saveItem = (item: QAItem): void => {
  if (!isLocalStorageAvailable) {
    inMemoryFallback = [item, ...inMemoryFallback];
    return;
  }
  try {
    const items = getAllItems();
    items.unshift(item); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving to local storage, falling back to in-memory", error);
    isLocalStorageAvailable = false;
    inMemoryFallback = [item, ...getAllItems()];
  }
};

export const deleteItem = (id: string): void => {
  if (!isLocalStorageAvailable) {
    inMemoryFallback = inMemoryFallback.filter(item => item.id !== id);
    return;
  }
  try {
    const items = getAllItems();
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting from local storage", error);
  }
};
