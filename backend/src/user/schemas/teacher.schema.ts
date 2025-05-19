// schemas/teacher.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type TeacherDocument = Teacher & Document;

export enum TeacherPlan {
  EASY = 'EASY',
  MIDDLE = 'MIDDLE',
}

@Schema()
export class Teacher {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop()
  photo: string;

  @Prop()
  address: string;

  @Prop()
  bio: string;

  @Prop({ enum: TeacherPlan, default: TeacherPlan.EASY })
  teacher_plan: TeacherPlan;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
