import { User, UserInstance } from "../models/User";
import * as UserService from "./Userservice";

describe("Testando User service", () => {
  let email = "teste@jest.com";
  let password = "1234";

  beforeAll(async () => {
    await User.sync({ force: true });
  });

  it("Deve criar um novo usuário", async () => {
    const newUser = (await UserService.createUser(email, password)) as UserInstance;
    expect(newUser).not.toBeInstanceOf(Error);
    expect(newUser).toHaveProperty("email");
    expect(newUser.email).toBe(email);
    expect(newUser).not.toBeNull();
  });

  it("Deve criar um usuário com o email existente", async () => {
    const newUser = (await UserService.createUser(email, password)) as UserInstance;
    expect(newUser).toBeInstanceOf(Error);
  });

  it("deve encontrar um usuário pelo email", async () => {
    const user = (await UserService.findByEmail(email)) as UserInstance;
    expect(user.email).toBe(email);
  });

  it("Deve combinar com a senha do banco de dados", async () => {
    const user = (await UserService.findByEmail(email)) as UserInstance;
    const match = await UserService.matchPassword("invalid", user.password);
    expect(match).toBeFalsy();
  });

  it("Deve retornar uma lista de usuários", async () => {
    const users = await UserService.all();
    expect(users.length).toBeGreaterThanOrEqual(1);
    for (let i in users) {
      expect(users[i]).toBeInstanceOf(User);
    }
  });

  it("Não deve registrar um usuário sem a senha", async () => {
    const newUser = await UserService.createUser(email, "");
    expect(newUser).toBeInstanceOf(Error);
  });

  it("Não deve registrar um usuário sem o email", async () => {
    const newUser = await UserService.createUser(email, password);
    expect(newUser).toBeInstanceOf(Error);
  });

  it("Não deve registrar um usuário sem os dados", async () => {
    const newUser = await UserService.createUser(email, password);
    expect(newUser).toBeInstanceOf(Error);
  });

  it("Deve logar corretamente", async () => {
    const user = await UserService.findByEmail(email);
    expect(user).not.toBeNull(); 
    if (user) {
      const isMatch = await UserService.matchPassword(password, user.password);
      expect(isMatch).toBeTruthy();
    }
  });
  
});
