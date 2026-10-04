import { BillStatus, BillType } from '@invoicely/constants';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmptyObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IsNotPastDate } from '../../../helper/validators/is-not-past-date.validator';
import {
  BillingDetailsDto,
  BillLineItemDto,
  BillVendorSnapshotDto,
} from './create-bill.dto';

export class UpdateBillDto {
  @IsOptional()
  @IsDateString()
  @IsNotPastDate({ message: 'Bill date cannot be in the past' })
  billDate?: string;

  @IsOptional()
  @IsEnum(BillType)
  type?: BillType;

  @IsOptional()
  @IsEnum(BillStatus)
  status?: BillStatus;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BillVendorSnapshotDto)
  billToVendorDetails?: BillVendorSnapshotDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BillVendorSnapshotDto)
  shipToVendorDetails?: BillVendorSnapshotDto;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one product is required' })
  @ValidateNested({ each: true })
  @Type(() => BillLineItemDto)
  products?: BillLineItemDto[];

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BillingDetailsDto)
  billingDetails?: BillingDetailsDto;
}
