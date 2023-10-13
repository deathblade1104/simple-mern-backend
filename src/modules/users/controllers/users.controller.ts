import { Application, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Errors from '../../../core/errors';
import utils from '../../../core/utils';
import { IUserEntity } from '../interfaces/users.interface';
import UserModel from '../models/users.model';
import UserService from '../services/users.service';

class UserController {
  UserModel;
  UsersService;
  constructor() {
    this.UserModel = UserModel;
    this.UsersService = UserService;
  }

  private async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const body: IUserEntity = req.body;
      if (!utils.isEmptyObject(this.UsersService.getUserByEmail(body.email))) {
        throw new Errors.BadRequestError(`User already registered with ${body.email} Email.`);
      }
      await this.UserModel.create(body);
      res.status(StatusCodes.CREATED).json({ message: 'Success.' });
    } catch (err) {
      next(err);
    }
  }

  public init(app: Application) {
    app.post('/api/user/signup', this.signup);
  }
}

export default new UserController();
