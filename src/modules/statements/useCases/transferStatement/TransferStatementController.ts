import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferStatementUseCase } from "./TransferStatementUseCase";

class TransferStatementController {
  async execute (request: Request, response: Response) {
    const { id: send_user_id } = request.user;
    const { user_id } = request.params;
    const { amount, description } = request.body;

    const transferStatementUseCase = container.resolve(TransferStatementUseCase);

    const transferStatement = await transferStatementUseCase.execute({
      amount,
      description,
      send_user_id,
      user_id
    });

    return response.json(transferStatement);
  }
}

export { TransferStatementController };
