import 'dotenv/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';

const client = jwksClient({
  jwksUri: process.env.CLERK_JWKS_ENDPOINT,
});

@Injectable()
export class ClerkGuard implements CanActivate {
  private publicKey: string;
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();

    if (isPublic) return true;

    const cookies = req.cookies;
    let clientToken = cookies['__session'];
    if (!clientToken) clientToken = req?.headers['authorization']?.substring(7);
    if (!clientToken) throw new UnauthorizedException();

    try {
      if (!this.publicKey) {
        const key = await client.getSigningKey();
        this.publicKey = key.getPublicKey();
      }

      const decoded = jwt.verify(clientToken, this.publicKey);
      const clerkUserId = decoded['sub'] as string;
      req.clerkUserId = clerkUserId;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
