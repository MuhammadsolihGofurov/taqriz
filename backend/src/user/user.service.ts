import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  UserRole,
  UserStatus,
} from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user-dto';
import { Student, StudentDocument } from './schemas/student.schema';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  async createUserWithEmail(data: CreateUserDTO, token: string) {
    const { email, full_name, password, role, phone_number } = data;

    // userni izlash
    const existingUser = await this.userModel.findOne({ email });

    // user bo'lsa va statusi in_registrationga teng bo'lsa
    if (
      existingUser &&
      (existingUser.status === UserStatus.IN_REGISTRATION ||
        existingUser.status === UserStatus.NO_ACTIVE)
    ) {
      await this.userModel.deleteOne({ email });
      if (existingUser.role === UserRole.STUDENT) {
        await this.studentModel.deleteOne({ user: existingUser._id });
      } else if (existingUser.role === UserRole.TEACHER) {
        await this.teacherModel.deleteOne({ user: existingUser._id });
      }
    } else if (existingUser) {
      throw new Error(
        'User already exists and is verified or in a different status',
      );
    }

    // passwordni hashlemiz
    const hashedPassword = await bcrypt.hash(password, 10);

    // yangi user create qilamiz
    const newUser = new this.userModel({
      full_name,
      password: hashedPassword,
      email,
      phone_number,
      status: UserStatus.IN_REGISTRATION,
      verifyToken: token,
      role,
    });

    // user malumotlarini saqlab qaytarib yuboramiz
    const savedUser = await newUser.save();

    if (role === UserRole.STUDENT) {
      await this.studentModel.create({ user: savedUser._id });
    } else if (role === UserRole.TEACHER) {
      await this.teacherModel.create({
        user: savedUser._id,
      });
    }

    return savedUser;
  }

  async findByVerifyToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ verifyToken: token });
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }
}
