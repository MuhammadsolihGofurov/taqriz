import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDTO } from 'src/user/dto/create-user-dto';
import { UserRole, UserStatus } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: MailService,
  ) {}

  async register(data: CreateUserDTO): Promise<any> {
    const token = randomBytes(32).toString('hex');

    const user = await this.userService.createUserWithEmail(data, token);

    await this.emailService.sendVerificationEmail(data.email, token);
    return { message: 'Emailingizga tasdiqlash havolasi yuborildi' };
  }

  async confirmEmail(token: string): Promise<{ message: string }> {
    const user = await this.userService.findByVerifyToken(token);
    if (!user) {
      throw new NotFoundException('Noto‘g‘ri yoki eskirgan token');
    }

    if (user.status == UserStatus.ACTIVE) {
      return { message: 'Email allaqachon tasdiqlangan' };
    }

    user.status = UserStatus.ACTIVE;
    user.verifyToken = 'null';
    await user.save();

    return { message: 'Email muvaffaqiyatli tasdiqlandi' };
  }

  async login(userInput: LoginUserDTO) {
    const existingUser = await this.userService.findUserByEmail(
      userInput.email,
    );

    if (!existingUser) {
      throw new NotFoundException('Bunday foydalanuvchi mavjud emas.');
    }

    if (
      existingUser.status === UserStatus.IN_REGISTRATION ||
      existingUser.status === UserStatus.NO_ACTIVE
    ) {
      throw new UnauthorizedException('Foydalanuvchi hali faol emas.');
    }

    const isPasswordMatch = await bcrypt.compare(
      userInput.password,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Parol noto‘g‘ri.');
    }

    const payload = {
      full_name: existingUser.full_name,
      sub: existingUser._id,
      role: existingUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      full_name: existingUser.full_name,
      _id: existingUser._id,
      role: existingUser.role,
      email: existingUser.email,
      phone_number: existingUser.phone_number,
    };
  }
}
