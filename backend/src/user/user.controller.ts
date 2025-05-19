import { Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from './schemas/user.schema';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {

  @Patch('/update-student-info')
  @Roles(UserRole.STUDENT)
  async updateStudentInfo() {}

  @Patch('/update-teacher-info')
  async updateTeacherInfo() {}
  
}
