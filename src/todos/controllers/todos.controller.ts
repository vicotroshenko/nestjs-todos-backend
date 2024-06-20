import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Put,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { UserDto } from './../../user/dtos/user.dto';
import HttpResponse from 'src/constants/httpResponse.constant';
import { TODO_ROUTS } from 'src/constants/routs.constant';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { TodosService } from '../services/todos.service';
import { CustomReqQuery } from 'src/types/todos.type';
import { TestExceptionFilter } from 'src/filters/TestExceptionFilter.filter';
import { CreateTodoDto } from '../dtos/CreateTodo.dto';

@UseFilters(TestExceptionFilter)
@Controller(TODO_ROUTS.TODOS)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Get(TODO_ROUTS.ALL)
  async getAllTodo(@Req() req: Request, @Res() res: Response): Promise<void> {
    const { id } = req.user as UserDto;
    const query = req.query as CustomReqQuery;
    const todos = await this.todosService.findAll(id, query);
    const statistic = await this.todosService.statistic(id, query);
    const statTodos = statistic._count.id;
    res.send({
      statTodos,
      todos,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(TODO_ROUTS.GET_BY_ID)
  async getOneTodo(@Req() req: Request, @Res() res: Response): Promise<void> {
    const id = req.params.id;
    const todo = await this.todosService.findOne(id);
    if (!todo) {
      throw new HttpException(HttpResponse.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    res.send(todo);
  }

  @UseGuards(JwtAuthGuard)
  @Post(TODO_ROUTS.CREATE)
  async createNewTodo(
    @Req() req: Request,
    @Body() body: CreateTodoDto,
    @Res() res: Response,
  ): Promise<void> {
    const { id: owner } = req.user as UserDto;
    const newTodo = await this.todosService.createOne({
      ...body,
      owner,
    });
    res.status(HttpStatus.CREATED).send(newTodo);
  }

  @UseGuards(JwtAuthGuard)
  @Put(TODO_ROUTS.PUT_BY_ID)
  async updateOneTodo(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const id = req.params.id;
    const data = req.body;
    const updatedTodo = await this.todosService.updateOne(id, data);

    if (!updatedTodo) {
      throw new HttpException(HttpResponse.BAD_ID, HttpStatus.BAD_REQUEST);
    }

    res.send(updatedTodo);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(TODO_ROUTS.DELETE_BY_ID)
  async deleteOneTodo(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const id = req.params.id;
    const deletedTodo = await this.todosService.deleteOne(id);

    if (!deletedTodo) {
      throw new HttpException(HttpResponse.BAD_ID, HttpStatus.BAD_REQUEST);
    }
    res.send({ message: HttpResponse.DELETED });
  }
}
