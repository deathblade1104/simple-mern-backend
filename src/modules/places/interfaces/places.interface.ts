import { Document, Types } from 'mongoose';

export interface IPlaceEntity {
  title: string;
  description: string;
  image: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  created_by: Types.ObjectId;
}

export interface IPlaceDoc extends IPlaceEntity, Document {}
