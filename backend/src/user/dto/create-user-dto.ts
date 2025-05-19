import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDTO {
  @IsNotEmpty()
  full_name: string;
  
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
