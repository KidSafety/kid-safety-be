import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { COOKIES_EXPIRE_TIME_MILLISECONDS, TOKEN_KEY_NAME } from './constant';
import { Cookies } from './decorators/cookies.decorator';
import { Public } from './decorators/public.decorator';
import {
  ChangePasswordDto,
  ChangePasswordZSchema,
} from './dtos/changePassword.dto';
import {
  FirstTimePasswordDto,
  FirstTimePasswordZSchema,
} from './dtos/firstTimePassword.dto';
import { GenerateUserDto } from './dtos/generateUser.dto';
import { ZodPipe } from './pipe/zod.pipe';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('generate')
  @Public()
  async generate(
    @Body() data: GenerateUserDto,
    @Res({ passthrough: true }) response,
  ) {
    const user = await this.authService.generateUser(data.id, data.email);
    const jwt = await this.authService.generateJWT(user);
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'None',
      expires: new Date(Date.now() + COOKIES_EXPIRE_TIME_MILLISECONDS),
    };

    response.cookie(TOKEN_KEY_NAME, jwt, cookieOptions);
    return user;
  }

  @Post('logout')
  @Public()
  async logout(@Cookies() cookies, @Res({ passthrough: true }) res) {
    for (const cookie in cookies) {
      res.cookie(cookie, '', {
        httpOnly: true,
        secure: 'auto',
        expires: new Date(),
      });
    }
    return 'Logged out successfully!';
  }

  @Post('/first-password')
  async setPassword(
    @Req() req,
    @Body(new ZodPipe(FirstTimePasswordZSchema)) payload: FirstTimePasswordDto,
  ) {
    const user = req?.user;
    return this.authService.setFirstTimePassword(user, payload.newPassword);
  }

  @Post('change-password')
  async changePassword(
    @Req() req,
    @Body(new ZodPipe(ChangePasswordZSchema)) payload: ChangePasswordDto,
  ) {
    const user = req?.user;
    return this.authService.changePassword(
      user,
      payload.currentPassword,
      payload.newPassword,
    );
  }
}
