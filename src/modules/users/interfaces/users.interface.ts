import { Document, Types } from 'mongoose';

export interface IUserEntity {
  name: string;
  email: string;
  password: string;
  image: string;
  places: [Types.ObjectId];
}

export interface IUserDoc extends IUserEntity, Document {}
