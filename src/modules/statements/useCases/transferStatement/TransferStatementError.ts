import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferStatementError {
  export class UserReceiverNotFound extends AppError {
    constructor() {
      super('User receiver not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds for transfer', 400);
    }
  }
}
