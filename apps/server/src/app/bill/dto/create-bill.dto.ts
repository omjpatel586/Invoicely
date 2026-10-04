import {
  BillType,
  GST_SLABS,
  GstSlab,
  MONEY_PATTERN,
  ProductUnit,
} from '@invoicely/constants';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsDefined,
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { IsNotPastDate } from '../../../helper/validators/is-not-past-date.validator';
import { moneyMessage } from '../../../helper/validators/validation.messages';

export class BillVendorSnapshotDto {
  @IsMongoId({ message: 'vendor id must be a valid id' })
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class BillLineItemDto {
  @IsMongoId({ message: 'product id must be a valid id' })
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsString()
  @IsNotEmpty()
  hsnCode: string;

  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  quantity: number;

  @IsEnum(ProductUnit)
  unit: ProductUnit;

  @Matches(MONEY_PATTERN, { message: moneyMessage('unitPrice') })
  unitPrice: string;

  @IsIn(GST_SLABS, {
    message: `gstSlab must be one of: ${GST_SLABS.join(', ')}`,
  })
  gstSlab: GstSlab;

  @Matches(MONEY_PATTERN, { message: moneyMessage('totalPrice') })
  totalPrice: string;
}

export class BillingDetailsDto {
  @Matches(MONEY_PATTERN, { message: moneyMessage('amount') })
  amount: string;

  @Matches(MONEY_PATTERN, { message: moneyMessage('cgstAmount') })
  cgstAmount: string;

  @Matches(MONEY_PATTERN, { message: moneyMessage('sgstAmount') })
  sgstAmount: string;

  @Matches(MONEY_PATTERN, { message: moneyMessage('igstAmount') })
  igstAmount: string;

  @Matches(MONEY_PATTERN, { message: moneyMessage('gstAmount') })
  gstAmount: string;

  @Matches(MONEY_PATTERN, { message: moneyMessage('totalAmount') })
  totalAmount: string;
}

export class CreateBillDto {
  @IsNotEmpty({ message: 'Bill date is required' })
  @IsDateString()
  @IsNotPastDate({ message: 'Bill date cannot be in the past' })
  billDate: string;

  @IsEnum(BillType)
  type: BillType;

  @IsDefined({ message: 'Bill to vendor is required' })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BillVendorSnapshotDto)
  billToVendorDetails: BillVendorSnapshotDto;

  @IsDefined({ message: 'Ship to vendor is required' })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BillVendorSnapshotDto)
  shipToVendorDetails: BillVendorSnapshotDto;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one product is required' })
  @ValidateNested({ each: true })
  @Type(() => BillLineItemDto)
  products: BillLineItemDto[];

  @IsDefined({ message: 'Billing details are required' })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BillingDetailsDto)
  billingDetails: BillingDetailsDto;
}
