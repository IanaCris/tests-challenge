import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferStatementError } from "./TransferStatementError";

interface IRequest {
  sender_id: string;
  user_id: string;
  amount: number;
  description: string;
}

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER =  'transfer',
}
@injectable()
class TransferStatementUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ amount, description, sender_id, user_id}: IRequest) {
    //verifica se o usuario recebedor existe
    const user_receiver = await this.usersRepository.findById(user_id);

    if(!user_receiver) {
      throw new TransferStatementError.UserReceiverNotFound();
    }

    //verifica se usuario que envia tem saldo para poder tranferir - nao transf. valor maior que o saldo atual
    const balance_sender = await this.statementsRepository.getUserBalance({user_id: sender_id});

    if (balance_sender.balance < amount) {
      throw new TransferStatementError.InsufficientFunds();
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type: "transfer" as OperationType,
      amount,
      description
    });

    return statementOperation;
  }
}

export { TransferStatementUseCase };
