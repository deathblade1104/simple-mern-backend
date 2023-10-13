import { Application, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Model } from 'mongoose';
import Errors from '../../../core/errors';
import utils from '../../../core/utils';
import Database from '../../../setupDatabase';
import userService from '../../users/services/users.service';
import { IPlaceDoc, IPlaceEntity } from '../interfaces/places.interface';
import PlaceModel from '../models/places.model';
import placeService from '../services/place.service';

class PlaceController {
  placeModel: Model<IPlaceDoc>;
  placeService;
  userService;

  constructor() {
    this.placeModel = PlaceModel;
    this.placeService = placeService;
    this.userService = userService;
  }
  private async createPlace(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dbInstance = Database.getInstance();
    const session = await dbInstance.getSession();
    try {
      const body: IPlaceEntity = req.body;
      if (utils.isEmptyObject(body)) {
        throw new Errors.BadRequestError('Request Body is empty. Paramters are required to create a Place entity.');
      }
      if (utils.isEmptyObject(await this.userService.UserModel.findById(body.created_by))) {
        throw new Errors.NotFoundError(`No User Found Assosciated with ID - ${body.created_by}.`);
      }
      session.startTransaction();
      const currPlace = await this.placeModel.create([body], { session: session });
      await this.userService.addPlaceToUser(currPlace[0].created_by, currPlace[0]._id, session);
      await session.commitTransaction();
      res.status(StatusCodes.CREATED).json({ message: 'Success', place: currPlace });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
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
    const dbInstance = Database.getInstance();
    const session = await dbInstance.getSession();
    try {
      const placeId = req.params.id;
      const currPlace = await this.placeService.findPlaceById(placeId);
      session.startTransaction();
      await this.userService.removePlaceFromUser(currPlace.created_by, currPlace._id, session);
      await this.placeModel.deleteOne({ _id: placeId }, { session });
      await session.commitTransaction();
      res.status(StatusCodes.OK).json({ message: 'Success' });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
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
