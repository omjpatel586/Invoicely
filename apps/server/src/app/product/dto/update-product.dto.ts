import { GstSlab, ProductUnit } from '@invoicely/constants';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  hsnCode?: string;

  @IsOptional()
  @IsEnum(GstSlab)
  gstSlab?: GstSlab;

  @IsOptional()
  @IsEnum(ProductUnit)
  unit?: ProductUnit;

  @IsOptional()
  @IsString()
  unitPrice?: string;
}
