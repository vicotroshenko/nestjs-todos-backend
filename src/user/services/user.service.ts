import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import prisma from '../../db/prisma.db';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}

  createToken(data: string): string {
    return this.jwtService.sign({ data });
  }

  convertToken(token: string): { [x: string]: string } {
    return this.jwtService.decode(token);
  }

  async findUser(email: string): Promise<UserDto | null> {
    const result = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return !result ? null : result;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserDto, 'password'> | null> {
    const findUser = await this.findUser(email);

    if (!findUser) return null;

    const passwordCompare = await compare(password, findUser.password);

    if (passwordCompare) {
      const { password, ...result } = findUser;
      return result;
    }
    return null;
  }

  async registerUser(credentials: UserDto): Promise<UserDto | null> {
    const { email } = credentials;
    const findUser = await this.findUser(email);
    if (findUser) return null;

    const token = this.createToken(email);
    const verificationToken = this.createToken(email);

    const data = {
      ...credentials,
      token,
      verificationToken,
    };
    return await prisma.user.create({
      data,
    });
  }

  async loginUser(credentials: UserDto): Promise<UserDto | null> {
    const { email } = credentials;

    const token = this.createToken(email);

    return await prisma.user.update({
      where: {
        email,
      },
      data: { ...credentials, token },
    });
  }

  async logoutUser(email: string): Promise<UserDto | null> {
    const findUser = await this.findUser(email);
    if (findUser) return null;

    return await prisma.user.update({
      where: {
        email,
      },
      data: { ...findUser, token: '' },
    });
  }

  async updateUser(
    email: string,
    updatedUser: UserDto,
  ): Promise<UserDto | null> {
    const token = this.createToken(email);
    const result = await prisma.user.update({
      where: {
        email,
      },
      data: { ...updatedUser, token },
    });

    return !result ? null : result;
  }

  async verifyUser(token: string): Promise<UserDto | null> {
    const { email } = this.convertToken(token);
    const user = await this.findUser(email);

    if (!user) return null;

    return await this.updateUser(email, { ...user, isConfirmed: true });
  }
}
