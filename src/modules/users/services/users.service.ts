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
}

export default new UserService();
