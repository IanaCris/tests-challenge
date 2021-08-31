import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferStatementUseCase } from "./TransferStatementUseCase";

class TransferStatementController {
  async execute (request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { receiver_user_id } = request.query;
    const { amount, description } = request.body;

    const transferStatementUseCase = container.resolve(TransferStatementUseCase);

    const transferStatement = await transferStatementUseCase.execute();

    return response.json(transferStatement);
  }
}

export { TransferStatementController };
