export interface Coupon {
  _id: string;
  code: string;
  description: string;
  type: "percent" | "fixed";
  value: number;
  maxDiscount?: number;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  maxUses?: number;
  currentUses?: number;
  status?: "active" | "inactive" | "expired" | "archived";
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
