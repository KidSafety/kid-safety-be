import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async generateUser(userId?: string, email?: string): Promise<User> {
    return await this.usersService.generateUser(userId, email);
  }

  async generateJWT(user: User): Promise<string> {
    const payload = { ...user };
    return this.jwtService.sign(payload);
  }
}
