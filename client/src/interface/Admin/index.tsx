export interface Transaction {
  id: number | null;
  uniqueId: string | null;
  username: string | null;
  name: string | null;
  status: string | null;
  paymentAmount: number | null;
  paymentDate: string;
  cancelRequestDate: string | null;
  canceledAmount: number | null;
  cancelDate: string | null;
}

export interface User {
  id: number | null;
  username: string | null;
  name: string | null;
  userStatus: string | null;
  signupDate: string;
  dormantDate: string | null;
  orderTotal: number | null;
}
