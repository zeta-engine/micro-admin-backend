import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces/categories/category.interface';

const ackErrors: string[] = ['E11000']
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category, @Ctx() context: RmqContext) {

    const channel = context.getChannelRef();
    const originalMesage = context.getMessage();

    this.logger.log(`category: ${JSON.stringify(category)}`)

    try {
      await this.appService.createCategory(category);
      await channel.ack(originalMesage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      ackErrors.forEach( async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMesage);
        }
      });
    }
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() _id: string) {
    if(_id) {
      return await this.appService.getCategoryByID(_id);
    } else {
      return await this.appService.getAllCategories();
    }
  }

}
