import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@localhost:27017/sr-admin-backend',
      { authSource: 'admin', useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }
    ),
    CategoriesModule,
    PlayersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
