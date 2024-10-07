import request from "supertest";
import app from "../app";
import { User } from "../models/User";

describe("Testando rotas da API", () => {
  let email = "test@jest.com";
  let password = "1234";

  beforeAll(async () => {
    await User.sync({ force: true });
  });

  it("Deve ping pong", (done) => {
    request(app)
      .get("/ping")
      .then((response) => {
        expect(response.body.pong).toBeTruthy();
        done();
      })
      .catch(done);  
  });

  it("Deve registrar um novo usuário", (done) => {
    request(app)
      .post("/register")
      .send(`email=${email}&password=${password}`)
      .then((response) => {
        expect(response.body.error).toBeUndefined();
        done();
      })
      .catch(done);  
  });

  it("Não deve registrar um novo usuário com email existente", (done) => {
    request(app)
      .post("/register")
      .send(`email=${email}&password=${password}`)
      .then((response) => {
        expect(response.body.error).not.toBeUndefined();
        expect(response.body.error).toBe("Email já existe"); 
        done();
      })
      .catch(done); 
  });

  it("Não deve registrar um usuário sem a senha", (done) => {
    request(app)
      .post("/register")
      .send(`email=${email}`)
      .then((response) => {
        expect(response.body.error).not.toBeUndefined();
        expect(response.body.error).toBe("E-mail e/ou senha não enviados."); 
        done();
      })
      .catch(done);  
  });

  it("Não deve registrar um usuário sem o email", (done) => {
    request(app)
      .post("/register")
      .send(`password=${password}`)
      .then((response) => {
        expect(response.body.error).not.toBeUndefined();
        expect(response.body.error).toBe("E-mail e/ou senha não enviados."); 
        done();
      })
      .catch(done);  
  });

  it("Não deve registrar um usuário sem os dados", (done) => {
    request(app)
      .post("/register")
      .send({})
      .then((response) => {
        expect(response.body.error).not.toBeUndefined();
        expect(response.body.error).toBe("E-mail e/ou senha não enviados."); 
        done();
      })
      .catch(done); 
  });

  it("Deve logar corretamente", (done) => {
    request(app)
      .post("/login")
      .send(`email=${email}&password=${password}`)
      .then((response) => {
        expect(response.body.error).toBeUndefined();
        expect(response.body.status).toBe(true); 
        done();
      })
      .catch(done); 
  });
});
