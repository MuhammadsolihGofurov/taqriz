import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // boshqa modullarda import qilish shart emas
      envFilePath: getEnvFilePath(),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    UserModule,
    AuthModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}


function getEnvFilePath() {
  const env = process.env.NODE_ENV;
  if (env === 'production') return '.env.production';
  if (env === 'development') return '.env.development.local';
  return '.env';
}
