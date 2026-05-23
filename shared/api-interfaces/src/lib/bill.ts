import {
  BillStatus,
  BillType,
  GstSlabNumeric,
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
  quantity: number | null;
  unit: ProductUnit | null;
  unitPrice: string | null;
  gstSlab: GstSlabNumeric | null;
  totalPrice: string | null;
}

export interface IBillingDetails {
  amount: string | null;
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
  billNumber: string;
  billDate?: Date;
  type: BillType;
  status?: BillStatus;
  billToVendorDetails?: IBillVendorSnapshot | null;
  shipToVendorDetails?: IBillVendorSnapshot | null;
  products?: IBillLineItem[];
  billingDetails?: IBillingDetails | null;
}
