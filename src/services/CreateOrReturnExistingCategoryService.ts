import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface CategoryDTO {
  title: string;
}

class CreateOrReturnExistingCategoriesService {
  public async execute({ title }: CategoryDTO): Promise<Category> {
    const categoryRepository = getRepository(Category);

    let categoryObj = await categoryRepository.findOne({ title });
    if (!categoryObj) {
      categoryObj = await categoryRepository.create({ title });
      categoryObj = await categoryRepository.save(categoryObj);
    }

    return categoryObj;
  }
}

export default CreateOrReturnExistingCategoriesService;
