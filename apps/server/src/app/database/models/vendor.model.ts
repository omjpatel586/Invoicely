import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SchemaTypes, Types } from 'mongoose';
import { SoftDeletePlugin } from '.';
import { BaseSchema } from './base.model';

@Schema({ _id: false })
class VendorAddress {
  @Prop({ type: String, trim: true, default: null })
  line1: string | null;

  @Prop({ type: String, trim: true, default: null })
  city: string | null;

  @Prop({ type: String, trim: true, default: null })
  state: string | null;

  @Prop({ type: String, trim: true, default: null })
  pinCode: string | null;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Vendor extends BaseSchema {
  override _id: Types.ObjectId;

  @Prop({ type: String, trim: true, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: String, trim: true, default: null })
  @IsOptional()
  @IsString()
  description: string | null;

  @Prop({ type: String, trim: true, lowercase: true, default: null })
  @IsOptional()
  @IsEmail()
  email: string | null;

  @Prop({ type: String, trim: true, default: null })
  @IsOptional()
  @IsString()
  countryCode: string | null;

  @Prop({ type: String, trim: true, default: null })
  @IsOptional()
  @IsString()
  mobileNumber: string | null;

  @Prop({ type: String, trim: true, default: null })
  @IsOptional()
  @IsString()
  gstIn: string | null;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Company',
    required: true,
  })
  company: Types.ObjectId;

  @Prop({ type: VendorAddress, default: {} })
  @IsOptional()
  address: VendorAddress;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
VendorSchema.plugin(SoftDeletePlugin);
VendorSchema.index({ company: 1 });
VendorSchema.index({ gstIn: 1, company: 1 });
