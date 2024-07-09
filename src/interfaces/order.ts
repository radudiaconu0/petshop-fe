import {User} from "@/interfaces/user";

interface Address {
  billing: string;
  shipping: string;
}
export interface Order {
  uuid: string;
  user: User;
  products: Product[];
  payment: Payment;
  order_status: OrderStatus[];
  address: Address;
  delivery_fee: number;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  uuid: string;
  price: number;
  product: string;
  quantity: number;
}

type PaymentType = 'credit_card' | 'cash_on_delivery' | 'bank_transfer';

export interface Payment {
  uuid: string;
  type: PaymentType;
  details: any;
  created_at: string;
  updated_at: string;
}

export interface OrderStatus {
  uuid: string;
  title: string;
  created_at: string;
  updated_at: string;
}
