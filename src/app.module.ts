import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerSchema } from './interfaces/players/player.schema';
import { CategorySchema } from './interfaces/categories/category.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@localhost:27017/sr-admin-backend',
      { authSource: 'admin', useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }
    ),
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Player', schema: PlayerSchema }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
