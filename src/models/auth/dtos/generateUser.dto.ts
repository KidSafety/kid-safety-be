import { IsEmail, IsOptional } from 'class-validator';

export class GenerateUserDto {
  @IsOptional()
  id?: string;
  @IsEmail()
  @IsOptional()
  email?: string;
}
