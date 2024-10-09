import request from "supertest";
import app from "../app";
import { User } from "../models/User";


describe("Testando rotas da API", () => {
  let email = "test@jest.com";
  let password = "1234";
  let userId = 1;

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
        console.log(response.body)
        userId = response.body.id; // salva o id na variavel para usar dps 
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

  it("Não deve logar com os dados incorretos", (done) => {
    request(app)
      .post("/login")
      .send(`email=${email}&password=wrongpassword`)
      .then((response) => {
        expect(response.body.error).toBeUndefined();
        expect(response.body.status).toBe(false); 
        done();
      })
      .catch(done); 
  });

it("Deve listar os usuários", (done) => {
  request(app)
    .get("/list")
    .then((response) => {
      expect(response.body.error).toBeUndefined();
      expect(Array.isArray(response.body.list)).toBe(true); 
      expect(response.body.list.length).toBeGreaterThan(0); // Espera que haja pelo menos um usuário
      done();
    })
    .catch(done); 
});


  it("Deve excluir um usuário", (done) => {
    request(app)
      .delete(`/delete/${userId}`)
      .then((response) => {
        expect(response.body.error).toBeUndefined();
        expect(response.body.message).toBe("Usuário excluído com sucesso");
        done();
      })
      .catch(done); 
  });

  it("Não deve excluir um usuário inexistente", (done) => {
    request(app)
      .delete(`/delete/999999`) // soca qualquer id aq
      .then((response) => {
        expect(response.body.error).not.toBeUndefined();
        expect(response.body.error).toBe("usuário nao encontrado");
        done();
      })
      .catch(done); 
  });
});
