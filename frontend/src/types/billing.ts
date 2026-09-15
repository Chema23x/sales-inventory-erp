// src/types/billing.ts

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIAL';
export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface Subscription {
  id: string;
  clientId: string;
  planName: string;
  status: SubscriptionStatus;
  price: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  billingDate: string;
  createdAt: string;
}

export interface BillingSummary {
  activeSubscriptions: number;
  monthlyRecurringRevenue: number;
  totalRevenue: number;
  recentPayments: Payment[];
}
