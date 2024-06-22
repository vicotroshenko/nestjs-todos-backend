import { ApiProperty } from '@nestjs/swagger';


export class RegisterUserDto {
  @ApiProperty({
    example: 'user',
    required: true,
  })
  username: string;

  @ApiProperty({
    example: 'user@mail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: '11User_password',
    required: true,
  })
  password: string;
}