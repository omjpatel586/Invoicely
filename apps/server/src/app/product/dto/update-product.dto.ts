import {
  GST_SLABS,
  GstSlab,
  MONEY_PATTERN,
  ProductUnit,
} from '@invoicely/constants';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { moneyMessage } from '../../../helper/validators/validation.messages';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  hsnCode?: string;

  @IsOptional()
  @IsIn(GST_SLABS, {
    message: `gstSlab must be one of: ${GST_SLABS.join(', ')}`,
  })
  gstSlab?: GstSlab;

  @IsOptional()
  @IsEnum(ProductUnit)
  unit?: ProductUnit;

  @IsOptional()
  @Matches(MONEY_PATTERN, { message: moneyMessage('unitPrice') })
  unitPrice?: string;
}
