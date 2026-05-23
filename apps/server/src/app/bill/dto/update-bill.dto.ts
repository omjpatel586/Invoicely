import { BillStatus, BillType, GstSlabNumeric, ProductUnit } from '@invoicely/constants';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

class BillVendorSnapshotDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

class BillLineItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsEnum(ProductUnit)
  unit?: ProductUnit;

  @IsOptional()
  @IsString()
  unitPrice?: string;

  @IsOptional()
  @IsEnum(GstSlabNumeric)
  gstSlab?: GstSlabNumeric;

  @IsOptional()
  @IsString()
  totalPrice?: string;
}

class BillingDetailsDto {
  @IsOptional()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsString()
  gstAmount?: string;

  @IsOptional()
  @IsString()
  totalAmount?: string;
}

export class UpdateBillDto {
  @IsOptional()
  @IsEnum(BillType)
  type?: BillType;

  @IsOptional()
  @IsEnum(BillStatus)
  status?: BillStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => BillVendorSnapshotDto)
  billToVendorDetails?: BillVendorSnapshotDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BillVendorSnapshotDto)
  shipToVendorDetails?: BillVendorSnapshotDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillLineItemDto)
  products?: BillLineItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BillingDetailsDto)
  billingDetails?: BillingDetailsDto;
}
