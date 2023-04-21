import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { User } from 'src/user/entity';
import { Repository } from 'typeorm';
import { LoginDTO, RegisterDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

    private readonly cfgService: ConfigService,
  ) {}

  async register(account: RegisterDTO): Promise<User> {
    const hashedPass = await argon.hash(account.password);

    account.password = hashedPass.toString();

    return await this.userRepository.save(account);
  }

  async login(account: LoginDTO) {
    const acc = await this.userRepository.findOne({
      where: [{ username: account.username }],
    });

    if (!acc) {
      throw new ForbiddenException('User not found');
    }

    const matchPassword = await argon.verify(acc.password, account.password);

    if (!matchPassword) {
      throw new ForbiddenException('Password does not match');
    }
    delete acc.password;

    console.log(acc);

    return await this.setToken(acc.id);
  }

  async setToken(id: number): Promise<{ accessToken: string }> {
    const payload = {
      subject: id,
    };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.cfgService.get('JWT_SECRET'),
    });

    return {
      accessToken: jwtString,
    };
  }
}
