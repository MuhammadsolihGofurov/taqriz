import { Nullable } from './../../../node_modules/mongodb/src/mongo_types';
// schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  NO_ACTIVE = 'NO_ACTIVE',
  IN_REGISTRATION = 'IN_REGISTRATION',
  ACTIVE = 'ACTIVE',
}

@Schema()
export class User {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone_number: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserStatus, default: UserStatus.NO_ACTIVE })
  status: UserStatus;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop()
  verifyToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
