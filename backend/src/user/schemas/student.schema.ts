// schemas/student.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type StudentDocument = Student & Document;

export enum StudentPlan {
  EASY = 'EASY',
  MIDDLE = 'MIDDLE',
}

@Schema()
export class Student {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop()
  photo: string;

  @Prop()
  address: string;

  @Prop()
  bio: string;

  @Prop({ enum: StudentPlan, default: StudentPlan.EASY })
  student_plan: StudentPlan;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
