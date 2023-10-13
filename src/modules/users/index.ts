import { Application } from 'express';
import userController from './controllers/users.controller';

const init = (app: Application): void => {
  userController.init(app);
};

export default init;
