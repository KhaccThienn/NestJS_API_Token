import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto';
import { plainToClass } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() account: RegisterDTO) {
    const validatedAcc = plainToClass(RegisterDTO, account, {
      excludeExtraneousValues: true,
    });

    return this.authService.register(validatedAcc);
  }

  @Post('login')
  async login(@Body() account: LoginDTO) {
    const validatedAcc = plainToClass(LoginDTO, account, {
      excludeExtraneousValues: true,
    });
    return this.authService.login(validatedAcc);
  }
}
