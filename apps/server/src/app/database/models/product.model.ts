import { GstSlab, ProductUnit } from '@invoicely/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { SoftDeletePlugin } from '.';
import { BaseSchema } from './base.model';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Product extends BaseSchema {
  @Prop({ type: String, trim: true, default: null })
  @IsOptional()
  @IsString()
  description: string | null;

  @Prop({ type: String, trim: true, default: null })
  @IsOptional()
  @IsString()
  hsnCode: string | null;

  @Prop({ type: String, trim: true, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  })
  company: string;

  @Prop({
    type: String,
    enum: [
      GstSlab.ZERO,
      GstSlab.FIVE,
      GstSlab.TWELVE,
      GstSlab.EIGHTEEN,
      GstSlab.TWENTY_EIGHT,
    ],
    default: null,
  })
  @IsOptional()
  @IsEnum(GstSlab)
  gstSlab: GstSlab | null;

  @Prop({
    type: String,
    enum: [
      ProductUnit.KG,
      ProductUnit.LITRE,
      ProductUnit.GRAM,
      ProductUnit.PCS,
    ],
    default: null,
  })
  @IsOptional()
  @IsEnum(ProductUnit)
  unit: ProductUnit | null;

  @Prop({ type: Number, required: true })
  unitPrice: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(SoftDeletePlugin);
ProductSchema.index({ company: 1, name: 1 });