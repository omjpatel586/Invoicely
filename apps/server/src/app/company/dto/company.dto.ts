import {
  CompanyStatus,
  ConstitutionOfBusiness,
  IndianState,
  TaxPayerType,
} from '@invoicely/constants';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class AddressDto {
  @IsOptional()
  @IsString()
  buildingName?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  buildingNumber?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsEnum(IndianState)
  state?: IndianState | null;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  flatNumber?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

class BranchAddressDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  splitAddress?: AddressDto;
}

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  gstIn: string;

  @IsNotEmpty()
  @IsString()
  legalName: string;

  @IsNotEmpty()
  @IsString()
  tradeName: string;

  @IsNotEmpty()
  @IsEnum(ConstitutionOfBusiness)
  constitutionOfBusiness: ConstitutionOfBusiness;

  @IsNotEmpty()
  @IsEnum(TaxPayerType)
  taxPayerType: TaxPayerType;

  @IsNotEmpty()
  @IsEnum(CompanyStatus)
  status: CompanyStatus;

  @IsNotEmpty()
  @IsString()
  stateJurisdiction: string;

  @IsNotEmpty()
  @IsString()
  centerJurisdiction: string;

  @IsNotEmpty()
  @IsString()
  headOfficeAddress: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  headOfficeSplitAddress?: AddressDto;

  @IsOptional()
  @IsDateString()
  registrationDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BranchAddressDto)
  branches?: BranchAddressDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  natureOfBusiness?: string[];

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isUseCompanyEmail?: boolean;

  userId?: string;
}
