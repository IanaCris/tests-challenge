import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate user", async () => {
    const user: ICreateUserDTO =  {
      name: "nameuser",
      email: "email@test.com",
      password: "1234",
    }

    await createUserUseCase.execute(user);

    const resultAuth = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    })

    expect(resultAuth).toHaveProperty("token");
  });

  it("shoud not be able to authenticate an nonexistent user", () => {
    expect(async ()=> {
      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "1234",
      })
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO =  {
        name: "nameuser",
        email: "email@test.com",
        password: "1234",
      }

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "senhaincorreta",
      })
    }).rejects.toBeInstanceOf(AppError);
  });
});
