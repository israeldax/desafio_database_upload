import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import CreateOrReturnExistingCategoryService from './CreateOrReturnExistingCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type))
      throw new AppError('Invalid transaction type');

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > total)
      throw new AppError('Invalid banlance', 400);

    const createOrReturnExistingCategory = new CreateOrReturnExistingCategoryService();
    const relatedCategory = await createOrReturnExistingCategory.execute({
      title: category,
    });

    let transaction = await transactionsRepository.create({
      title,
      value,
      type,
      category: relatedCategory,
    });
    transaction = await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
