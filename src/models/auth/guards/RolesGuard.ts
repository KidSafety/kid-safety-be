import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import 'dotenv/config';
import { UsersService } from 'src/models/users/users.service';

const ROLES = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(ROLES, context.getHandler());
    if (!roles) return true;
    const req = context.switchToHttp().getRequest();
    const clerkUserId = req.clerkUserId;
    const user = await this.userService.getUserByClerkId(clerkUserId);
    return this.matchRoles(roles, user?.role);
  }

  private matchRoles(roles: string[], userRole: string): boolean {
    return roles.some((role) => role === userRole);
  }
}
