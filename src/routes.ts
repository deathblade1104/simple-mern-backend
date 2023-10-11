import { Application } from 'express';
import placesModule from './modules/places/index';

export default (app: Application) => {
  placesModule(app);
};
