import { IsString, IsBoolean, MinLength, IsOptional, IsDateString } from 'class-validator';

export class CreateTodoDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  completed: boolean;

  @IsBoolean()
  private: boolean;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @IsOptional()
  @IsString()
  owner: string;
}