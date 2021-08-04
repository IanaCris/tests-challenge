// import { type } from "node:os";
import { type } from "node:os";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createStatementUsecase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
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

  it("should be able to create a new statement of withdraw with sufficient balance", async () => {
    const user: ICreateUserDTO = {
      name: "NameUser",
      email: "email@test.com",
      password: "1234",
    }

    const userCreated = await createUserUseCase.execute(user);
    const userID = userCreated.id as string;

    await createStatementUsecase.execute({
      user_id: userID,
      description: "Compra sofa",
      amount: 5000,
      type: OperationType.DEPOSIT,
    });

    const statement: ICreateStatementDTO = {
      user_id: userID,
      description: "Venda sofa",
      amount: 500,
      type: OperationType.WITHDRAW,
    }

    const statementeTwo = await createStatementUsecase.execute(statement);

    expect(statementeTwo).toHaveProperty("id");
  });

  it("should not be able to create a new statement of withdraw without sufficient balance", async () => {
    const user: ICreateUserDTO = {
      name: "NameUser",
      email: "email@test.com",
      password: "1234",
    }

    const userCreated = await createUserUseCase.execute(user);
    const userID = userCreated.id as string;

    await createStatementUsecase.execute({
      user_id: userID,
      description: "Compra sofa",
      amount: 100,
      type: OperationType.DEPOSIT,
    });

    const statement: ICreateStatementDTO = {
      user_id: userID,
      description: "Venda sofa",
      amount: 500,
      type: OperationType.WITHDRAW,
    }

    const statementTwo = await createStatementUsecase.execute(statement);

    console.log("statementTwo", statementTwo);

    expect(statementTwo).toThrow();
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
