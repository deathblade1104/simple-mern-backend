import { Document } from 'mongoose';

export interface IUserEntity {
  name: string;
  email: string;
  password: string;
  image: string;
  places: string;
}

export interface IUserDoc extends IUserEntity, Document {}
