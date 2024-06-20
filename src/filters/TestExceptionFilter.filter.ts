import { CustomErrorResponse } from './../types/error.type';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class TestExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const responseBody =
      exception instanceof HttpException
        ? (exception.getResponse() as CustomErrorResponse)
        : {
            statusCode: 500,
            error: 'Internal server error',
          };

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
