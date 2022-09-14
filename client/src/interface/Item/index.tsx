export interface Item {
  id: number;
  itemName: string;
  price: number;
  category: string;
  img: string;
  stock: number;
  status: string;
  sold: number;
}

export interface PaidItem {
  id: number;
  itemName: string;
  price: number;
  quantity: number;
  img: string;
}

export interface PaidList {
  id: number;
  uniqueId: string;
  status: string;
  date: string;
  totalPrice: number;
  items: PaidItem[];
  cancelRequestDate: string | null;
  cancelDate: string | null;
}
