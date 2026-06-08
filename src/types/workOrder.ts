export interface WorkOrder {
  id: string;
  project: string;
  overtime: boolean;
  hours: number;
  createdAt: string;
}

export type UserRole = 'admin' | 'user';
