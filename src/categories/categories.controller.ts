import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/category.interface';

const ackErrors: string[] = ['E11000']
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  private logger = new Logger(CategoriesController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category, @Ctx() context: RmqContext) {

    const channel = context.getChannelRef();
    const originalMesage = context.getMessage();

    this.logger.log(`category: ${JSON.stringify(category)}`)

    try {
      await this.categoriesService.createCategory(category);
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
  async getCategories(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMesage = context.getMessage();
    try {
      if(_id) {
        return await this.categoriesService.getCategoryByID(_id);
      } else {
        return await this.categoriesService.getAllCategories();
      }
    } finally {
      await channel.ack(originalMesage);
    }
  }

  @EventPattern('update-category')
  async updateCategory(
    @Payload() data: any, @Ctx() context: RmqContext) {

    const channel = context.getChannelRef();
    const originalMesage = context.getMessage();

    this.logger.log(`category: ${JSON.stringify(data)}`)

    try {
      const _id: string = data._id;
      const category: Category = data.category;
      await this.categoriesService.updateCategory(_id, category)
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
}