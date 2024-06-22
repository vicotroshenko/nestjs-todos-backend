import { ApiProperty } from '@nestjs/swagger';

export class PasswordUserDto {
  @ApiProperty({
    example: '13victor27',
    required: true,
  })
  newPassword: string;
}
