import { Provider } from '@invoicely/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SoftDeletePlugin } from '.';
import { BaseSchema } from './base.model';

@Schema({ timestamps: true, versionKey: false })
export class User extends BaseSchema {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ type: String, enum: Provider, default: Provider.GOOGLE })
  provider: Provider;

  @Prop()
  email: string;

  @Prop({ default: '' })
  password: string;

  @Prop()
  profile: string;

  @Prop({ type: Object, default: {} })
  google: object;

  constructor() {
    super();
    this.firstName = '';
    this.lastName = '';
    this.provider = Provider.GOOGLE;
    this.email = '';
    this.password = '';
    this.profile = '';
    this.google = {};
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(SoftDeletePlugin);
