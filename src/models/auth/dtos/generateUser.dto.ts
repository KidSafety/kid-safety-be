import { IsEmail, IsOptional } from 'class-validator';

export class GenerateUserDto {
  @IsOptional()
  userId?: string;
  @IsEmail()
  @IsOptional()
  email?: string;
}
