import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './interfaces/players/player.interface';
import { Category } from './interfaces/categories/category.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

	constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>, 
    @InjectModel('Player') private readonly playerModel: Model<Player>) {}
	
	async createCategory(category: Category): Promise<Category> {
    try {
      const createdCategory = new this.categoryModel(category);
      return await createdCategory.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getAllCategories() {
    return await this.categoryModel.find().populate('players').exec();
  }

  async getCategoryByID(_id: string) : Promise<Category> {
    const foundCategory = await this.categoryModel.findOne({_id}).populate('players').exec();
    if(!foundCategory) {
      throw new NotFoundException(`Category ${_id} not found`);
    }
    return foundCategory;
  }
}
