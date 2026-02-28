import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({})
export class BaseSchema extends Document {
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}