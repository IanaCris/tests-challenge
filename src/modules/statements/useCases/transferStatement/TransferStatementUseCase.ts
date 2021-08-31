import { inject, injectable } from "tsyringe";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";

interface IRequest {
  send_user_id: string;
  user_id: string;
  amount: number;
  description: string;
}
@injectable()
class TransferStatementUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ amount, description, send_user_id, user_id}: IRequest) {

  }
}

export { TransferStatementUseCase };
