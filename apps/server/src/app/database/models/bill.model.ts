import {
  BillStatus,
  BillType,
  GstSlabNumeric,
  ProductUnit,
} from '@invoicely/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { SoftDeletePlugin } from '.';
import { BaseSchema } from './base.model';

@Schema({ _id: false })
class VendorDetails {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Vendor', default: null })
  id: string | null;

  @Prop({ type: String, default: null })
  name: string | null;
}

@Schema({ _id: false })
class BillProduct {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product', default: null })
  id: string | null;

  @Prop({ type: String, default: null })
  name: string | null;

  @Prop({ type: String, default: null })
  description: string | null;

  @Prop({ type: Number, default: null })
  quantity: number | null;

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
  unit: ProductUnit | null;

  @Prop({ type: SchemaTypes.Decimal128, default: null })
  unitPrice: string | null;

  @Prop({
    type: Number,
    enum: [
      GstSlabNumeric.ZERO,
      GstSlabNumeric.FIVE,
      GstSlabNumeric.TWELVE,
      GstSlabNumeric.EIGHTEEN,
      GstSlabNumeric.TWENTY_EIGHT,
    ],
    default: null,
  })
  gstSlab: GstSlabNumeric | null;

  @Prop({ type: SchemaTypes.Decimal128, default: null })
  totalPrice: string | null;
}

@Schema({ _id: false })
class BillingDetails {
  @Prop({ type: SchemaTypes.Decimal128, default: null })
  amount: string | null;

  @Prop({ type: SchemaTypes.Decimal128, default: null })
  gstAmount: string | null;

  @Prop({ type: SchemaTypes.Decimal128, default: null })
  totalAmount: string | null;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Bill extends BaseSchema {
  @Prop({ type: Number, required: true, trim: true })
  billNumber: number;

  @Prop({ type: Date, required: true, default: Date.now })
  billDate: Date;

  @Prop({ type: VendorDetails, default: {} })
  billToVendorDetails: VendorDetails;

  @Prop({ type: VendorDetails, default: {} })
  shipToVendorDetails: VendorDetails;

  @Prop({ type: [BillProduct], default: [] })
  products: BillProduct[];

  @Prop({ type: BillingDetails, default: {} })
  billingDetails: BillingDetails;

  @Prop({
    type: String,
    enum: BillType,
    required: true,
  })
  type: BillType;

  @Prop({
    type: String,
    enum: BillStatus,
    default: BillStatus.DRAFT,
  })
  status: BillStatus;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Company',
    required: true,
  })
  company: string;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
BillSchema.plugin(SoftDeletePlugin);
BillSchema.index({ company: 1 });
BillSchema.index({ billNumber: 1, company: 1 }, { unique: true });
