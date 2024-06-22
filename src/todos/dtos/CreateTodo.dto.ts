import {
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    example: 'task # 1',
    required: true,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: 'description of the task # 1',
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: false,
    required: true,
  })
  @IsBoolean()
  completed: boolean;

  @ApiProperty({
    example: false,
    required: true,
  })
  @IsBoolean()
  private: boolean;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @IsOptional()
  @IsString()
  owner: string;
}
