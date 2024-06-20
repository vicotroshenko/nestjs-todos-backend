import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class UserDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  isConfirmed: boolean;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  verificationToken?: string;
}