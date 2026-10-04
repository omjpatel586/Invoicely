import {
  BillStatus,
  BillType,
  GstSlab,
  ProductUnit,
} from '@invoicely/constants';

export interface IBillVendorSnapshot {
  id: string | null;
  name: string | null;
}

export interface IBillLineItem {
  id: string | null;
  name: string | null;
  description: string | null;
  hsnCode: string | null;
  quantity: number | null;
  unit: ProductUnit | null;
  unitPrice: string | null;
  gstSlab: GstSlab | null;
  totalPrice: string | null;
}

export interface IBillingDetails {
  amount: string | null;
  cgstAmount: string | null;
  sgstAmount: string | null;
  igstAmount: string | null;
  gstAmount: string | null;
  totalAmount: string | null;
}

export interface IBill {
  _id: string;
  billNumber: number;
  billDate: Date;
  type: BillType;
  status: BillStatus;
  billToVendorDetails: IBillVendorSnapshot;
  shipToVendorDetails: IBillVendorSnapshot;
  products: IBillLineItem[];
  billingDetails: IBillingDetails;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateBillRequest {
  billNumber?: number;
  billDate?: Date;
  type: BillType;
  status?: BillStatus;
  billToVendorDetails?: IBillVendorSnapshot | null;
  shipToVendorDetails?: IBillVendorSnapshot | null;
  products?: IBillLineItem[];
  billingDetails?: IBillingDetails | null;
}
