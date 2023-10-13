import { Application, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Model } from 'mongoose';
import Errors from '../../../core/errors';
import utils from '../../../core/utils';
import { ILoginDTO } from '../interfaces/user.dto.interface';
import { IUserDoc, IUserEntity } from '../interfaces/users.interface';
import UserModel from '../models/users.model';
import UserService from '../services/users.service';

class UserController {
  UserModel: Model<IUserDoc>;
  UsersService;

  constructor() {
    this.UserModel = UserModel;
    this.UsersService = UserService;
  }

  private async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body: IUserEntity = req.body;
      if (!utils.isEmptyObject(await this.UsersService.getUserByEmail(body.email))) {
        throw new Errors.BadRequestError(`User already registered with ${body.email} Email.`);
      }
      await this.UserModel.create({
        name: body.name,
        email: body.email,
        password: body.password,
        image: body.image,
        places: body.places ? [body.places] : []
      });
      res.status(StatusCodes.CREATED).json({ message: 'Success.' });
    } catch (err) {
      next(err);
    }
  }
  private async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body: ILoginDTO = req.body;
      const currUser = await this.UsersService.getUserByEmail(body.email);

      if (currUser === null || utils.isEmptyObject(currUser)) {
        throw new Errors.NotFoundError(`No User found associated with ${body.email} Email Id`);
      }

      if (currUser.password !== body.password) {
        throw new Errors.UnauthorizedError(`Password Incorrect.`);
      }
      res.status(StatusCodes.OK).json({ message: 'Successfully, logged in.' });
    } catch (err) {
      next(err);
    }
  }

  private async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usersList = await this.UserModel.find({}, { password: 0, _id: 0, __v: 0 }).exec();
      res.status(StatusCodes.OK).json({ users: usersList });
    } catch (err) {
      next(err);
    }
  }

  public init(app: Application) {
    app.post('/api/user/signup', this.signup);
    app.post('/api/user/login', this.login);
    app.get('/api/users/usersList', this.getAllUsers);
  }
}

export default new UserController();
