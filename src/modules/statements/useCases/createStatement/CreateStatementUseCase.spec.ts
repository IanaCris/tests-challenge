// import { type } from "node:os";
import { type } from "node:os";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createStatementUsecase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUsecase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository);
  });

  it("should be able to create a new statement of deposit", async () => {
    const user: ICreateUserDTO = {
      name: "NameUser",
      email: "email@test.com",
      password: "1234",
    }

    const userCreated = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {
      user_id: userCreated.id as string,
      description: "Venda sofa",
      amount: 500,
      type: OperationType.DEPOSIT,
    }

    const statementCreated = await createStatementUsecase.execute(statement);

    expect(statementCreated).toHaveProperty("id");
  });

  it("should not be able to create a new statement of withdraw without sufficient balance", async () => {

      const user: ICreateUserDTO = {
        name: "NameUser",
        email: "email@test.com",
        password: "1234",
      }

      const userCreated = await createUserUseCase.execute(user);
      const userID = userCreated.id as string;

      // await getBalanceUseCase.execute({user_id: userID});

      const statement: ICreateStatementDTO = {
        user_id: userID,
        description: "Venda sofa",
        amount: 500,
        type: OperationType.WITHDRAW,
      }

      const stare = await createStatementUsecase.execute(statement);

    expect(stare).toEqual("Insufficient funds");
  });

  it("should not be able to create a new statement with an user that doesn't exists and type is deposit", async () => {
    expect(async () => {
      const statement: ICreateStatementDTO = {
        user_id: "123",
        description: "Venda sofa",
        amount: 500,
        type: OperationType.DEPOSIT,
      }

      await createStatementUsecase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new statement with an user that doesn't exists and type is withdraw", async () => {
    expect(async () => {
      const statement: ICreateStatementDTO = {
        user_id: "123",
        description: "Compra sofa",
        amount: 800,
        type: OperationType.WITHDRAW,
      }

      await createStatementUsecase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });
});
