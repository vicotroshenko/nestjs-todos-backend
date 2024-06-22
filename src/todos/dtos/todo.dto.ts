import { ApiProperty } from '@nestjs/swagger';
import INITIAL_TODO from 'src/constants/initialTodo.constant';

export class TotoDto {
  @ApiProperty({
    example: INITIAL_TODO.ID,
    required: false,
  })
  id?: string;

  @ApiProperty({
    example: INITIAL_TODO.TITLE,
    required: true,
  })
  title: string;

  @ApiProperty({
    example: INITIAL_TODO.DESCRIPTION,
    required: true,
  })
  description: string;

  @ApiProperty({
    example: INITIAL_TODO.COMPLETED,
    required: true,
  })
  completed: boolean;

  @ApiProperty({
    example: INITIAL_TODO.PRIVATE,
    required: true,
  })
  private: boolean;

  @ApiProperty({
    example: INITIAL_TODO.CREATED_AT,
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    example: INITIAL_TODO.OWNER,
    required: false,
  })
  owner: string;
}
