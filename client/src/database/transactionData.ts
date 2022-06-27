interface Transaction {
  transactionId: number;
  userName: string;
  status: string;
  paymentAmount: number | null;
  paymentDate: string;
  canceledAmount: number | null;
  canceledDate: string | null;
}

export const transactionData: Transaction[] = [
  {
    transactionId: 1,
    userName: 'userone',
    status: '결제완료',
    paymentAmount: 56000,
    paymentDate: '2022-03-18',
    canceledAmount: null,
    canceledDate: null
  },
  {
    transactionId: 2,
    userName: 'userthree',
    status: '결제취소',
    paymentAmount: 52900,
    paymentDate: '2022-05-14',
    canceledAmount: 52900,
    canceledDate: '2022-05-14'
  },
  {
    transactionId: 2,
    userName: 'userthree',
    status: '결제완료',
    paymentAmount: 97500,
    paymentDate: '2022-06-01',
    canceledAmount: null,
    canceledDate: null
  }
];
