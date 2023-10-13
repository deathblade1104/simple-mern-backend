import { ClientSession, Types } from 'mongoose';
import { IUserDoc } from '../interfaces/users.interface';
import UserModel from '../models/users.model';

class UserService {
  UserModel;
  constructor() {
    this.UserModel = UserModel;
  }

  public async getUserByEmail(email: string): Promise<IUserDoc | null> {
    try {
      return await this.UserModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  }
  public async addPlaceToUser(userId: Types.ObjectId, placeId: Types.ObjectId, session: ClientSession): Promise<void> {
    try {
      await this.UserModel.findByIdAndUpdate({ _id: userId }, { $push: { places: placeId } }, { session });
      return;
    } catch (error) {
      throw error;
    }
  }

  public async removePlaceFromUser(
    userId: Types.ObjectId,
    placeId: Types.ObjectId,
    session: ClientSession
  ): Promise<void> {
    try {
      await this.UserModel.findByIdAndUpdate({ _id: userId }, { $pull: { places: placeId } }, { session });
      return;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
