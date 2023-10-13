import { Application } from 'express';
import placesModule from './modules/places';
import userModule from './modules/users';

export default (app: Application) => {
  placesModule(app);
  userModule(app);
};
