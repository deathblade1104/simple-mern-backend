import { Model } from 'mongoose';
import Errors from '../../../core/errors';
import utils from '../../../core/utils';
import { IPlaceDoc } from '../interfaces/places.interface';
import PlaceModel from '../models/places.model';

class PlaceService {
  static className: string = 'PlaceService';
  placeModel: Model<IPlaceDoc>;

  constructor() {
    this.placeModel = PlaceModel;
  }

  async findPlaceById(placeId: string): Promise<IPlaceDoc> {
    try {
      const currPlace: IPlaceDoc | null = await this.placeModel.findById(placeId);
      if (utils.isEmptyObject(currPlace)) {
        throw new Errors.NotFoundError(`Place with ${placeId} not found.`);
      }
      return currPlace as IPlaceDoc;
    } catch (error) {
      throw error;
    }
  }
}
export default new PlaceService();
