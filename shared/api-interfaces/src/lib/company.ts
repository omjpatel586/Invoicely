import {
  CompanyStatus,
  ConstitutionOfBusiness,
  TaxPayerType,
} from '@invoicely/constants';

export interface IAddress {
  buildingName: string;
  street: string;
  location: string;
  buildingNumber: string;
  district: string;
  state: string;
  city: string;
  flatNumber: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface IBranchAddress {
  address: string;
  splitAddress: IAddress;
}

export interface ICompany {
  _id: string;

  gstIn: string;
  legalName: string;
  tradeName: string;

  constitutionOfBusiness: ConstitutionOfBusiness;
  taxPayerType: TaxPayerType;
  status: CompanyStatus;

  stateJurisdiction: string;
  centerJurisdiction: string;

  headOfficeAddress: string;
  headOfficeSplitAddress: IAddress;

  registrationDate: Date;
  lastUpdatedOn: Date;

  branches: IBranchAddress[];

  natureOfBusiness: string[];

  phoneNumber: string;
  email: string;
  isUseCompanyEmail: boolean;

  userId: string;
}

export interface IVerifyGSTNumberRequest {
  gstNumber: string;
}

export interface IVerifyGSTNumberResponse extends Partial<ICompany> {
  readonly: unknown;
}