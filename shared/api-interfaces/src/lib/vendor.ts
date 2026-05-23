export interface IVendorAddress {
  line1: string | null;
  city: string | null;
  state: string | null;
  pinCode: string | null;
}

export interface IVendor {
  _id: string;
  name: string;
  description: string | null;
  email: string | null;
  countryCode: string | null;
  mobileNumber: string | null;
  gstIn: string | null;
  address: IVendorAddress;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateVendorRequest {
  name: string;
  description?: string | null;
  email?: string | null;
  countryCode?: string | null;
  mobileNumber?: string | null;
  gstIn?: string | null;
  address?: Partial<IVendorAddress> | null;
}
