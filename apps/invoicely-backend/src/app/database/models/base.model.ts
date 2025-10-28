import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({})
export class BaseSchema extends Document {
  override _id: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  constructor() {
    super();
    this._id = '';
    this.isDeleted = false;
    this.deletedAt = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
