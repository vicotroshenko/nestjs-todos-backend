import { ApiProperty } from '@nestjs/swagger';


export class LoginUserDto {
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