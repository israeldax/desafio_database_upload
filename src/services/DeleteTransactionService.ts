import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const { affected } = await transactionRepository.delete(id);
    if (!affected) throw new AppError('No transaction found', 400);
  }
}

export default DeleteTransactionService;
