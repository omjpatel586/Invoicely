import { ModelDefinition } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Schema } from 'mongoose';
import { BaseSchema } from './base.model';
import { Bill, BillSchema } from './bill.model';
import { Company, CompanySchema } from './company.model';
import { Product, ProductSchema } from './product.model';
import { User, UserSchema } from './user.model';
import { Vendor, VendorSchema } from './vendor.model';

export const Schemas: ModelDefinition[] = [
  { name: User.name, schema: UserSchema, collection: User.name },
  { name: Company.name, schema: CompanySchema, collection: Company.name },
  { name: Product.name, schema: ProductSchema, collection: Product.name },
  { name: Vendor.name, schema: VendorSchema, collection: Vendor.name },
  { name: Bill.name, schema: BillSchema, collection: Bill.name },
];

export * from './bill.model';
export * from './company.model';
export * from './product.model';
export * from './user.model';
export * from './vendor.model';

export interface ThisType {
  getFilter: () => Record<string, object>;
  where: (arg: Partial<BaseSchema>) => ThisType;
}

// ---------------- Soft Delete Plugin ----------------
export function SoftDeletePlugin(schema: Schema) {
  // ---------------- Pre-find hooks ----------------
  const preQuery = function (
    this: ThisType,
  ) {
    // Automatically filter out soft deleted docs
    if (!this.getFilter().includeDeleted) {
      this.where({ isDeleted: false });
    }
  };

  // Apply pre-hook to all query types matching regex
  // This will match: find, findOne, findOneAndUpdate, update, updateOne, updateMany, count, countDocuments, etc.
  schema.pre(/^(find|count|update|delete)/i, preQuery as unknown as CallbackWithoutResultAndOptionalError);

  // ---------------- Aggregation hook -----------------
  // schema.pre('aggregate', function (this, ops: Record<string, unknown>) {
  //   // Add isDeleted: false match to aggregation pipelines
  //   this.pipeline().unshift({ $match: { isDeleted: false } });
  //   next();
  // });

  // ---------------- Instance method ----------------
  schema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };

  schema.statics.softDeleteById = async function (id: string) {
    return this.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  };

  schema.statics.restoreById = async function (id: string) {
    return this.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
  };
}
