export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface QAItem {
  id: string;
  userId: string;
  question: string;
  answer: string;
  timestamp: number;
}

export type ViewState = 'home' | 'saved' | 'login' | 'register';
