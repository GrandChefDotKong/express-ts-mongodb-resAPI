import express from 'express';
import authentification from './authentification';

const router = express.Router();

export default (): express.Router => {
  authentification(router);

  return router;
}