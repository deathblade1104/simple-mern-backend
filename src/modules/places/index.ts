import { Application } from 'express';
import placeControlller from './controllers/place.controller';

const init = (app: Application): void => {
  placeControlller.init(app);
};

export default init;
