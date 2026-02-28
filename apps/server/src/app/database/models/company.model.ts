// company.schema.ts
import type { IAddress, IBranchAddress } from '@invoicely/api-interfaces';
import {
  CompanyStatus,
  ConstitutionOfBusiness,
  TaxPayerType,
} from '@invoicely/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SchemaTypes } from 'mongoose';
import { SoftDeletePlugin } from '.';
import { BaseSchema } from './base.model';

@Schema({ _id: false })
export class Address {
  @Prop({ type: String })
  buildingName: string;

  @Prop({ type: String })
  street: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  buildingNumber: string;

  @Prop({ type: String })
  district: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  flatNumber: string;

  @Prop({ type: String })
  pincode: string;

  @Prop({ type: Number })
  latitude: number;

  @Prop({ type: Number })
  longitude: number;
}

@Schema({ _id: false })
export class BranchAddress {
  @Prop({ type: String })
  address: string;

  @Prop()
  splitAddress: Address;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Company extends BaseSchema {
  @Prop({ type: String, index: true })
  @IsNotEmpty()
  @IsString()
  gstIn: string;

  @Prop({ type: String, trim: true })
    @IsNotEmpty()
  @IsString()
  legalName: string;

  @Prop({ type: String, trim: true })
    @IsNotEmpty()
  @IsString()
  tradeName: string;

  @Prop({
    type: String,
    enum: ConstitutionOfBusiness,
    default: null,
  })
    @IsNotEmpty()
  @IsEnum(ConstitutionOfBusiness)
  constitutionOfBusiness: ConstitutionOfBusiness;

  @Prop({
    type: String,
    enum: TaxPayerType,
    default: null,
  })
    @IsNotEmpty()
  @IsEnum(TaxPayerType)
  taxPayerType: TaxPayerType;

  @Prop({
    type: String,
    enum: CompanyStatus,
    default: CompanyStatus.ACTIVE,
  })
    @IsNotEmpty()
  @IsEnum(CompanyStatus)
  status: CompanyStatus;

  @Prop({ type: String, default: null })
    @IsNotEmpty()
  @IsString()
  stateJurisdiction: string;

  @Prop({ type: String, default: null })
    @IsNotEmpty()
  @IsString()
  centerJurisdiction: string;

  @Prop({ type: String, default: null })
    @IsNotEmpty()
  @IsString()
  headOfficeAddress: string;

  @Prop({ type: Address, default: {} })
  headOfficeSplitAddress: IAddress;

  @Prop({ type: Date, default: null })
  registrationDate: Date;

  @Prop({ type: [BranchAddress], default: [] })
  branches: IBranchAddress[];

  @Prop({ type: [String], default: [] })
  natureOfBusiness: string[];

  @Prop({ type: String, default: null })
  phoneNumber: string;

  @Prop({
    type: String,
    lowercase: true,
    trim: true,
    default: null,
  })
  email: string;

  @Prop({ type: Boolean, default: false })
  isUseCompanyEmail: boolean;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  })
  userId: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
CompanySchema.plugin(SoftDeletePlugin);