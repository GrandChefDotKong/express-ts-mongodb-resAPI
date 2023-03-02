import express from "express";
import { createUser, getUserByEmail } from '../db/users';
import { authentification, random } from "../helpers";


export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, name } = req.body;

    if(!email || !password || !name) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
    if(existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();

    const user = await createUser({
      email, 
      name, 
      authentification: {
        salt,
        password: authentification(salt, password)
      }
    });

    return res.status(200).json(user);

  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }

  return res.sendStatus(500);
}