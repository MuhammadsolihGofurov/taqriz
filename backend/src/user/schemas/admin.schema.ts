// schemas/student.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdminDocument = Admin & Document;

export enum AdminStatus {
  CHECKER = 'checker',
  MODERATOR = 'moderator',
}

@Schema()
export class Admin {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop()
  photo: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ enum: AdminStatus, default: AdminStatus.CHECKER })
  status: AdminStatus;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
