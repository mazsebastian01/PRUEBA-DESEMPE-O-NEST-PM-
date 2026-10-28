
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const existingUser = await this.usersService.findByEmail(
      createAuthDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    const user = await this.usersService.create({
     email: createAuthDto.email,
     password: hashedPassword,
     role: UserRole.TECHNICIAN,
     });

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async login(createAuthDto: CreateAuthDto) {
    const user = await this.usersService.findByEmail(
      createAuthDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
