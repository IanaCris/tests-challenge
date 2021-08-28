import { inject, injectable } from "tsyringe";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";

@injectable()
class TransferStatementUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute() {

  }
}

export { TransferStatementUseCase };
