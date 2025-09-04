// Shared types for Admin Panel components
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: any[];
  isBlocked: boolean;
  isEmailConfirmed?: boolean;
  createdAt: string;
  lastActivity?: string;
  authProvider?: 'local' | 'google';
}

export type { AdminStatistics } from '../../types/admin.types';
