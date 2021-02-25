import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './interfaces/player.schema';

@Module({
  providers: [PlayersService],
  controllers: [PlayersController],
  imports: [ MongooseModule.forFeature([
    { name: 'Player', schema: PlayerSchema },
  ]),]
})
export class PlayersModule {}
