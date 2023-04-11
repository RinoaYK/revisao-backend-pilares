import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";
import { TUserDB } from "./types";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

//Users
//GET all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string | undefined;

    if (q === undefined) {
      const result = await db("users");
      res.status(200).send(result);
    } else {
      const result = await db("users").where("name", "LIKE", `%${q}%`);
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

//POST user
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, name, email, password } = req.body;

    if(typeof id !== "string"){
        res.status(400)
        throw new Error("'id' deve ser string")
    }
    
    if(id.length < 4){
        res.status(400)
        throw new Error("'id' deve possuir pelo menos 4 caracteres")
    }

    if(typeof name !== "string"){
        res.status(400)
        throw new Error("'name' deve ser string")
    }
    
    if(name.length < 2){
        res.status(400)
        throw new Error("'name' deve possuir pelo menos 2 caracteres")
    }

    if(typeof email !== "string"){
        res.status(400)
        throw new Error("'email' deve ser string")
    }

    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
        throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
    }

    const [idExists]: TUserDB[] | undefined[] = await db("users").where({id})

    if(idExists){
        res.status(400)
        throw new Error("'id' já existe")
    }
    
    const [emailExists]: TUserDB[] | undefined[] = await db("users").where({email})

    if(emailExists){
        res.status(400)
        throw new Error("'email' já existe")
    }
    const newUser: TUserDB = {
        id,
        name,
        email,
        password
    }
    await db("users").insert(newUser)  
    res.status(201).send({
        message: "User criado com sucesso", 
        user:newUser
    })

  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

//DELETE user by id
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

//   Tasks
//   GET all tasks
//   POST task
//   PUT task by id
//   DELETE task by id

//   Users + Tasks
//   POST user to task by ids
//   DELETE user from task by ids
//   GET all users with tasks
