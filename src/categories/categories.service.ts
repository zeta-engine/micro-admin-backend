import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  private logger = new Logger(CategoriesService.name);

	constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>) {}
	
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

  async updateCategory(_id: string, category: Category): Promise<void> {
    try {
      await this.categoryModel.findOneAndUpdate({_id}, {$set: category}).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
