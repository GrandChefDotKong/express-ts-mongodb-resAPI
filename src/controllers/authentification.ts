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


export const login = async (req: express.Request, res: express.Response) => {

  try {

    const { email, password } = req.body;
    if(!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email)
      .select('+authentification.salt +authentification.password');

    if(!user || user?.authentification?.salt === undefined) {
      return res.sendStatus(400);
    }

    const expectedHash = authentification(user.authentification.salt, password);
    if(user.authentification.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentification.sessionToken = authentification(salt, user._id.toString());

    await user.save();
    res.cookie('ADORI-AUTH', user.authentification.sessionToken, 
      { domain: 'localhost', path: '/' });

    return res.status(200).json(user).end();

  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }

  return res.sendStatus(400);
}



