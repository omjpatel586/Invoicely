import {
  GST_SLABS,
  GstSlab,
  MONEY_PATTERN,
  ProductUnit,
} from '@invoicely/constants';
import { IsEnum, IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import { moneyMessage } from '../../../helper/validators/validation.messages';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  hsnCode: string;

  @IsIn(GST_SLABS, {
    message: `gstSlab must be one of: ${GST_SLABS.join(', ')}`,
  })
  gstSlab: GstSlab;

  @IsEnum(ProductUnit)
  unit: ProductUnit;

  @Matches(MONEY_PATTERN, { message: moneyMessage('unitPrice') })
  unitPrice: string;
}
