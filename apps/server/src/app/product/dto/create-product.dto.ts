import { GstSlab, ProductUnit } from '@invoicely/constants';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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

  @IsString()
  @IsNotEmpty()
  unitPrice: string;
}
