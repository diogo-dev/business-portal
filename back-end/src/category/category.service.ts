import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryRepository.findOneOrFail({ where: { id } });
      return category;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({ where: { slug } });
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    Object.assign(category, updateCategoryDto);

    return await this.categoryRepository.save(category);

    // return this.categoryRepository.save({ ...category, ...updateCategoryDto }); 
    // this doesn't trigger the entity listeners, so the slug won't be updated if the name changes
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
