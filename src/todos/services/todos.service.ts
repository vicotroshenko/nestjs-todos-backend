import { CreateTodoDto } from './../dtos/CreateTodo.dto';
import { Injectable } from '@nestjs/common';
import { QUERY } from 'src/constants/query.constant';
import prisma from 'src/db/prisma.db';
import { CustomReqQuery, StatisticType } from 'src/types/todos.type';

@Injectable()
export class TodosService {
  queryHandler(query: CustomReqQuery): { [x: string]: string | boolean } {
    const status = query?.status;
    const statusIsCorrect = Object.values(QUERY).includes(status as QUERY);

    return status && statusIsCorrect
      ? status === QUERY.PUBLIC
        ? { private: false }
        : { [status]: true }
      : {};
  }
  async findAll(
    id: string | undefined,
    query: CustomReqQuery,
  ): Promise<CreateTodoDto[]> {
    const search = query?.search;
    const skip = Number(query?.skip) || 0;
    const take = Number(query?.take) || 5;

    const filterByCondition = this.queryHandler(query);

    return await prisma.todo.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        OR: [{ owner: id }, { private: false }],
        title: {
          contains: search,
          mode: 'insensitive',
        },
        ...filterByCondition,
      },
    });
  }

  async findOne(id: string): Promise<CreateTodoDto | null> {
    return await prisma.todo.findUnique({
      where: {
        id,
      },
    });
  }

  async createOne(newTodo: CreateTodoDto): Promise<CreateTodoDto> {
    return await prisma.todo.create({
      data: newTodo,
    });
  }

  async updateOne(
    id: string,
    newTodo: CreateTodoDto,
  ): Promise<CreateTodoDto | null> {
    const todo = await this.findOne(id);
    if (!todo) return null;

    return await prisma.todo.update({
      where: {
        id,
      },
      data: newTodo,
    });
  }

  async deleteOne(id: string): Promise<CreateTodoDto | null> {
    const todo = await this.findOne(id);
    if (!todo) return null;
    return await prisma.todo.delete({
      where: {
        id,
      },
    });
  }
  async statistic(
    id: string | undefined,
    query: CustomReqQuery,
  ): Promise<StatisticType> {
    const search = query?.search;
    const filterByCondition = this.queryHandler(query);
    return await prisma.todo.aggregate({
      _count: {
        id: true,
      },
      where: {
        OR: [{ owner: id }, { private: false }],
        title: {
          contains: search,
          mode: 'insensitive',
        },
        ...filterByCondition,
      },
    });
  }
}
