import { Model, Schema, model } from 'mongoose';
import { IPlaceDoc } from '../interfaces/places.interface';

const placeSchema: Schema = new Schema<IPlaceDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    created_by: { type: String, required: true }
  },
  {
    timestamps: {
      updatedAt: 'updated_at',
      createdAt: 'created_at'
    }
  }
);

const PlaceModel: Model<IPlaceDoc> = model<IPlaceDoc>('Place', placeSchema, 'Place');

export default PlaceModel;
