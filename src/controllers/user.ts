import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);

  } catch (error) {
    console.log(400);
    return res.sendStatus(400);
  }
}

export const deleteUser =  async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if(!id) {
      return res.sendStatus(400);
    }

    const deletedUser = await deleteUserById(id);

    return res.status(200).json(deletedUser);

  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }

}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !id ) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id);
    if(!user) {
      return res.sendStatus(400);
    }
    
    user.name = name;
    await user.save();

    return res.status(200).json(user).end();
    
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}