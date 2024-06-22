import { PasswordUserDto } from './../dtos/password.dto';
import { HttpStatus } from '@nestjs/common/enums';
import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Req,
  Res,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { Request, Response } from 'express';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import HttpResponse from 'src/constants/httpResponse.constant';
import { USER_ROUTS } from 'src/constants/routs.constant';
import { EmailUserDto, LoginUserDto, RegisterUserDto } from '../dtos';
import { UserDto } from './../dtos/user.dto';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { LocalGuard } from '../guards/local.guard';
import { sendEmail } from '../heplers/sendEmail.helpre';

@ApiTags('User')
@Controller(USER_ROUTS.AUTH)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: HttpResponse.CREATED,
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: HttpResponse.BAD_REQUEST })
  @ApiResponse({ status: 409, description: HttpResponse.BAD_EMAIL })
  @Post(USER_ROUTS.REGISTER)
  async register(@Body() body: UserDto, @Res() res: Response): Promise<void> {
    const hashPassword = await hash(body.password, 10);
    const newUser = {
      ...body,
      password: hashPassword,
    };
    const verificationToken = this.userService.createToken(newUser.email);
    await sendEmail.sendRegistration(verificationToken, newUser.email);
    const result = await this.userService.registerUser(newUser);
    if (!result) {
      throw new HttpException(HttpResponse.BAD_EMAIL, HttpStatus.CONFLICT);
    }
    res.status(201).send(result);
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: HttpResponse.SUCCESS,
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: HttpResponse.BAD_REQUEST })
  @UseGuards(LocalGuard)
  @Post(USER_ROUTS.LOGIN)
  async login(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = req.user as UserDto;
    const result = await this.userService.loginUser(user);
    res.send(result);
  }

  @ApiResponse({ status: 200, description: HttpResponse.LOGOUT })
  @ApiResponse({ status: 400, description: HttpResponse.BAD_REQUEST })
  @UseGuards(JwtAuthGuard)
  @Post(USER_ROUTS.LOGOUT)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const { email } = req.user as { [x: string]: string };
    await this.userService.logoutUser(email);

    res.status(200).json({
      message: HttpResponse.LOGOUT,
    });
  }

  @ApiBody({ type: EmailUserDto })
  @ApiResponse({
    status: 200,
    description: 'Check your email. Confirm reset password',
  })
  @ApiResponse({ status: 400, description: HttpResponse.BAD_REQUEST })
  @Post(USER_ROUTS.RESET_PASSWORD)
  async resetPassword(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { email } = req.body;

    const user = await this.userService.findUser(email);
    if (!user) {
      throw new HttpException(HttpResponse.BAD_EMAIL, HttpStatus.BAD_REQUEST);
    }

    const verificationToken = this.userService.createToken(email);
    await sendEmail.sendPassword(verificationToken, email);

    res.json({
      message: `Check your email ${email}. Confirm reset password.`,
    });
  }

  @ApiBody({ type: PasswordUserDto })
  @ApiResponse({
    status: 200,
    description: HttpResponse.SUCCESS,
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: HttpResponse.BAD_REQUEST })
  @ApiResponse({ status: 404, description: HttpResponse.NOT_FOUND })
  @UseGuards(JwtAuthGuard)
  @Put(USER_ROUTS.CHANGE_PASSWORD)
  async changePassword(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { email } = req.user as UserDto;
    const { newPassword } = req.body;

    const user = await this.userService.findUser(email);

    if (!user) {
      throw new HttpException(HttpResponse.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const password = await hash(newPassword, 10);

    const result = await this.userService.updateUser(email, {
      ...user,
      password,
    });

    res.status(201).send(result);
  }

  @ApiResponse({ status: 200, description: HttpResponse.VERIFIED })
  @ApiResponse({ status: 401, description: HttpResponse.UNAUTHORIZED })
  @Get(USER_ROUTS.VERIFY)
  async verify(@Req() req: Request, @Res() res: Response): Promise<void> {
    const { token } = req.params;

    const result = this.userService.verifyUser(token);
    if (!result) {
      throw new HttpException(HttpResponse.BAD_TOKEN, HttpStatus.BAD_REQUEST);
    }
    res.send(
      `<h3 style="text-align: center">Great! ${HttpResponse.VERIFIED}!</h3>`,
    );
  }
}
