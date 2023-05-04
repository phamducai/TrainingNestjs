import { Schema, Document } from 'mongoose';

const UserSchema = new Schema<User>(
  {
    name: String,
    email: String,
    password: String,
    refreshToken: String,
  },
  {
    collection: 'users',
  },
);

export { UserSchema };

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken: string;
}
