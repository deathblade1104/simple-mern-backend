import { Model, Schema, model } from 'mongoose';
import uniqueValidator  from 'mongoose-unique-validator';
import { IUserDoc } from '../interfaces/users.interface';

const userSchema: Schema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: { type: String, required: true }
  },
  {
    timestamps: {
      updatedAt: 'updated_at',
      createdAt: 'created_at'
    }
  }
);

userSchema.plugin(uniqueValidator);
const UserModel: Model<IUserDoc> = model<IUserDoc>('User', userSchema, 'User');

export default UserModel;
