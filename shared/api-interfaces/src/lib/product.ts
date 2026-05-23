import { GstSlab, ProductUnit } from '@invoicely/constants';

export interface IProduct {
  _id: string;
  name: string;
  description: string | null;
  hsnCode: string | null;
  gstSlab: GstSlab | null;
  unit: ProductUnit | null;
  unitPrice: string;
  isActive: boolean;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProductRequest {
  name: string;
  description?: string | null;
  hsnCode?: string | null;
  gstSlab?: GstSlab | null;
  unit?: ProductUnit | null;
  unitPrice: string;
}
