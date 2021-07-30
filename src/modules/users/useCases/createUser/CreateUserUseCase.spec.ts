import { UsingJoinColumnOnlyOnOneSideAllowedError } from "typeorm";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase : CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "username",
      email: "username@test.com",
      password: "123456",
    }

    const userReturn = await createUserUseCase.execute(user);

    expect(userReturn).toHaveProperty("id");
  });

  it("should not be able to create a new user with an email already registered", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "username",
        email: "username@test.com",
        password: "123456",
      });

      await createUserUseCase.execute({
        name: "username",
        email: "username@test.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
