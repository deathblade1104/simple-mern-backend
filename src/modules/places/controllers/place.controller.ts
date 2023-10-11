import { Application, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Model } from 'mongoose';
import Errors from '../../../core/errors';
import utils from '../../../core/utils';
import { IPlaceDoc, IPlaceEntity } from '../interfaces/places.interface';
import PlaceModel from '../models/places.model';
import placeService from '../services/place.service';

class PlaceController {
  placeModel: Model<IPlaceDoc>;
  placeService;

  constructor() {
    this.placeModel = PlaceModel;
    this.placeService = placeService;
  }
  private async createPlace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body: IPlaceEntity = req.body;
      if (utils.isEmptyObject(body)) {
        throw new Errors.BadRequestError('Request Body is empty. Paramters are required to create a Place entity.');
      }
      const currPlace: IPlaceDoc = await this.placeModel.create(body);
      res.status(StatusCodes.CREATED).json({ message: 'Success', place: currPlace });
    } catch (error) {
      next(error);
    }
  }

  private async getPlaceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const placeId = req.params.id;
      const currPlace: IPlaceDoc = await this.placeService.findPlaceById(placeId);
      res.status(StatusCodes.OK).json({ message: 'Success', place: currPlace?.toObject() });
    } catch (error) {
      next(error);
    }
  }

  private async getPlaceByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      const placesArray: Array<IPlaceDoc> = await this.placeModel.find({ created_by: userId });
      if (utils.isUndefined(placesArray) || placesArray.length === 0) {
        throw new Errors.NotFoundError(`No Place found created by UserId :  ${userId}.`);
      }
      res.status(StatusCodes.OK).json({ message: 'Success', places: placesArray.map((place) => place.toObject()) });
    } catch (error) {
      next(error);
    }
  }

  private async updatePlaceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (utils.isEmptyObject(req.body)) {
        throw new Errors.BadRequestError('Request Body is empty. Paramter(s) are required to update a Place entity.');
      }
      const placeId = req.params.id;
      await this.placeService.findPlaceById(placeId);
      const updatedPlace = await this.placeModel.updateOne({ _id: placeId }, { $set: req.body }, { new: true });
      res.status(StatusCodes.OK).json({ message: 'Success', place: updatedPlace });
    } catch (error) {
      next(error);
    }
  }
  private async deletePlaceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const placeId = req.params.id;
      await this.placeService.findPlaceById(placeId);
      await this.placeModel.deleteOne({ _id: placeId });
      res.status(StatusCodes.OK).json({ message: 'Success' });
    } catch (error) {
      next(error);
    }
  }

  public init(app: Application): void {
    app.post('/api/place/create', this.createPlace);
    app.get('/api/place/:id', this.getPlaceById);
    app.get('/api/places/:userId', this.getPlaceByUserId);
    app.put('/api/place/:id', this.updatePlaceById);
    app.delete('/api/places/:id', this.deletePlaceById);
  }
}

export default new PlaceController();
