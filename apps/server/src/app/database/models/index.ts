import { ModelDefinition } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Schema } from 'mongoose';
import { BaseSchema } from './base.model';
import { User, UserSchema } from './user.model';

export const Schemas: ModelDefinition[] = [
  { name: User.name, schema: UserSchema, collection: User.name },
];

export interface ThisType {
  getFilter: () => Record<string, object>;
  where: (arg: Partial<BaseSchema>) => ThisType;
}

// ---------------- Soft Delete Plugin ----------------
export function SoftDeletePlugin(schema: Schema) {
  // Add soft delete fields if not already added
  if (!schema.path('isDeleted')) {
    schema.add({
      isDeleted: { type: Boolean, default: false },
      deletedAt: { type: Date, default: null },
    });
  }

  // ---------------- Pre-find hooks ----------------
  const preQuery = function (
    this: ThisType,
    next: CallbackWithoutResultAndOptionalError
  ) {
    // Automatically filter out soft deleted docs
    if (!this.getFilter().includeDeleted) {
      this.where({ isDeleted: false });
    }
    next();
  };

  // Apply pre-hook to all query types matching regex
  // This will match: find, findOne, findOneAndUpdate, update, updateOne, updateMany, count, countDocuments, etc.
  schema.pre(/^(find|count|update|delete)/i, preQuery);

  // ---------------- Aggregation hook -----------------
  schema.pre('aggregate', function (this, next) {
    // Add isDeleted: false match to aggregation pipelines
    this.pipeline().unshift({ $match: { isDeleted: false } });
    next();
  });

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
