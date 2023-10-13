import { Document } from 'mongoose';

export interface IPlaceEntity {
  title: string;
  description: string;
  image: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  created_by: string;
}

export interface IPlaceDoc extends IPlaceEntity, Document {}
