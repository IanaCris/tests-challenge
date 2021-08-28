import { Request, Response } from "express";

class TransferStatementController {
  async execute (request: Request, response: Response) {
    const { id: send_user_id } = request.user;
    const { user_id } = request.query;
    const { amount, description } = request.body;
  }
}

export { TransferStatementController };
