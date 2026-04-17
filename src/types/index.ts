// User types
export interface User {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Member types
export type MembershipStatus = 'active' | 'inactive' | 'pending' | 'rejected';

export interface Member {
  id: string;
  user: string | User;
  fullName: string;
  memberId: string;
  phone?: string;
  address?: string;
  occupation?: string;
  joinDate?: string;
  membershipStatus: MembershipStatus;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Savings types
export type SavingType = 'pokok' | 'wajib' | 'sukarela';
export type TransactionType = 'deposit' | 'withdrawal';
export type SavingStatus = 'pending' | 'completed' | 'failed';

export interface Saving {
  id: string;
  type: SavingType;
  transactionType: TransactionType;
  amount: number;
  status: SavingStatus;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  member: string | Member;
  [key: string]: unknown;
}

// Loan types
export type LoanStatus = 'active' | 'completed' | 'pending' | 'approved' | 'rejected' | 'defaulted';
export type LoanPurpose = 'productive' | 'consumptive' | 'education' | 'health' | 'other';
export type InstallmentStatus = 'paid' | 'unpaid' | 'overdue';

export interface InstallmentSchedule {
  installmentNo: number;
  dueDate: string;
  principal: number;
  interest: number;
  total: number;
  status: InstallmentStatus;
  paidDate?: string;
  [key: string]: unknown;
}

export interface Loan {
  id: string;
  loanId: string;
  amount: number;
  remainingBalance: number;
  totalPaid: number;
  interestRate: number;
  tenor: number;
  purpose: LoanPurpose;
  status: LoanStatus;
  disbursementDate?: string;
  installmentSchedule: InstallmentSchedule[];
  createdAt?: string;
  updatedAt?: string;
  member: string | Member;
  [key: string]: unknown;
}

// News types
export type NewsCategory = 'news' | 'announcement' | 'education';
export type NewsStatus = 'draft' | 'published';

export interface NewsContent {
  root?: {
    children?: Array<{
      type?: string;
      children?: Array<{
        text?: string;
        [key: string]: unknown;
      }>;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface NewsImage {
  id?: string;
  url: string;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  content?: NewsContent;
  excerpt?: string;
  category: NewsCategory;
  image?: NewsImage | string;
  publishedAt?: string;
  status: NewsStatus;
  author?: string | User;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Board Member types
export interface BoardMember {
  id: string;
  name: string;
  position?: string;
  role?: string;
  phone?: string;
  email?: string;
  photo?: NewsImage | string;
  period?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Settings types
export interface AppSettings {
  appName: string;
  primaryColor: string;
  accentColor: string;
  defaultLanguage: 'id' | 'en';
  address?: string;
  phone?: string;
  email?: string;
  [key: string]: unknown;
}

// API Response types
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiError {
  errors: Array<{
    message: string;
    field?: string;
  }>;
}
