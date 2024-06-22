import { ApiProperty } from '@nestjs/swagger';

export class EmailUserDto {
  @ApiProperty({
    example: 'user@mail.com',
    required: true,
  })
  email: string;
}
