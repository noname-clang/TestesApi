import { Request, Response } from 'express';
import * as UserService from '../services/Userservice'

//essa função é só para ver se a api se conectou corretamente
export const ping = (req: Request, res: Response) => {
    res.json({ pong: true });
}

// Exclui um usuário com base no email
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const {Useremail} = req.params; // Obtém o email do parâmetro da rota

        const deletedUser = await UserService.deleteUser(Useremail);

        if (deletedUser) {
            return res.json({ message: 'Usuário excluído com sucesso!' });
        } else {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao excluir o usuário.' });
    }
};


//essa função é para ver se é possível cadastrar um novo usuario
export const register = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password) {
        let { email, password } = req.body;

        const newUser = await UserService.createUser(email, password)

        if (newUser instanceof Error) {
            return res.json({ error: newUser.message })
        } else {
            res.status(201)
            return res.json({ id: newUser.id })
        }
    }
    res.json({ error: 'E-mail e/ou senha não enviados.' });
}

//Verifica se o email existe no banco de dados e compara a senha com a hash, se true, conecta
export const login = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        const user = await UserService.findByEmail(email)

        if (user && await UserService.matchPassword(password, user.password)) {
            return res.json({ status: true })
            
        }
    }

    return res.json({ status: false });
}


//Lista todos os emails cadastrados no banco de dados
export const list = async (req: Request, res: Response) => {
    let users = await UserService.all()
    let list: string[] = [];

    for (let i in users) {
        list.push(users[i].email);
    }

    res.json({ list });
}
