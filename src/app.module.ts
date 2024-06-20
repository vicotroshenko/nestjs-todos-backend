import { TodosModule } from './todos/todos.module';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';


@Module({
  imports: [TodosModule, UserModule],
})
export class AppModule {}
