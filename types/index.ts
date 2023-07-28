export enum Role {
  Admin = 'Admin',
  Member = 'Member',
  Child = 'Child',
}

export enum OnboardingStep {
  Family = 'Family',
  Members = 'Members',
  Jars = 'Jars',
  Completed = 'Completed',
}

export enum Schedule {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Fortnightly = 'Fortnightly',
  Monthly = 'Monthly',
}

export enum TransactionType {
  Credit = 'Credit',
  Debit = 'Debit',
}

export type Currency = {
  symbol: string;
  name: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
  code: string;
  namePlural: string;
  locations: string[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  balance: number;
  onboardingStep?: OnboardingStep;
  familyId?: string;
  family?: Family;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type Family = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currencyCode: string;
  members?: User[];
};

export type Jar = {
  id: string;
  name: string;
  familyId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  balance: string;
  autoCreditAmount: string;
  autoCreditSchedule: string;
  nextMoneyAt?: string;
};

export type Transaction = {
  id: string;
  amount: string;
  comment: string;
  type: TransactionType;
  pending: boolean;
  jarId: string;
  jar?: Jar;
  familyId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

type Response = {
  status: string;
};

export interface UserResponse extends Response {
  data?: User;
}

export interface FamilyResponse extends Response {
  data?: Family;
}

export interface AddMembersResponse extends Response {
  data?: { count: string };
}

export interface JarsResponse extends Response {
  data?: Jar[];
}

export interface TransactionResponse extends Response {
  pending: boolean;
}

export interface TransactionsResponse extends Response {
  data?: Transaction[];
}
