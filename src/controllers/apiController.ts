import { Request, response, Response } from "express";
//esse UserService serve para refatorar o codigo, deixa ele mais limpo de dividido, aqui  a gene so usa, no UserService é onde é adicionado, listado e apagado os usuarios
import * as UserService from "../services/Userservice";
import { User } from "../models/User";

//Essa função ping é um controlador de rota que retorna uma resposta JSON com o objeto { pong: true } para a rota /ping. Ela é exportada para ser usada em outras partes do código.
export const ping = (req: Request, res: Response) => {
  res.json({ pong: true });
};
//Controlador para registrar um novo usuario
export const register = async (req: Request, res: Response) => {
  if (req.body.email && req.body.password) { //Verifica se o email e a senha foram enviados
    let { email, password } = req.body; //Pega o valor do email e da senha no body

    const newUser = await UserService.createUser(email, password); //criasse o novo usuarios

    if (newUser instanceof Error) { //se por algum motivo retornar um erro, vem para ca
      return res.json({ error: newUser.message });
    } else {
      res.status(201); //se nao retornar o id do usuario
      return res.json({ id: newUser.id });
    }
  }
  res.json({ error: "E-mail e/ou senha não enviados." });
};

//verifica se o email existe no banco de dados
//e compara a senha o a hash do banco de dados, se forem iguais, retorna true
export const login = async (req: Request, res: Response) => {
  if (req.body.email && req.body.password) {
    let email: string = req.body.email;
    let password: string = req.body.password;

    const user = await UserService.findByEmail(email);

    if (user && (await UserService.matchPassword(password, user.password))) {
      res.json({ status: true });
      return;
    }
  }

  res.json({ status: false });
};

//lista todos os emails dos usuarios
export const list = async (req: Request, res: Response) => {
  let users = await UserService.all();
  let list: string[] = [];

  for (let i in users) {
    list.push(users[i].email);
  }

  res.json({ list });
};

//Função para excluir um usuario pelo email pegando esse email como parametro
//Chamamos o deleteUser do UserService passando o email como parametro, meio que dizendo para deletar o usuario com esse email
export const deleteUser = async(req: Request, res: Response)=>{
  try {
    const {Useremail} = req.params
    const deleteUser = await UserService.deleteUser(Useremail)
    if(deleteUser){
      return res.json({message: "Usuário excluído com sucesso"})
    }else{
      return res.status(404).json({error: "usuário nao encontrado"})
    }
  } catch (error) {
    return response.status(500).json({err: "erro ao excluir usuário"})
  }
}