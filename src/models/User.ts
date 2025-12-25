import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
  first_name: string;
  last_name: string;
  bio: string;
  profile_pic_url: string;
}

const UserSchema: Schema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    bio: { type: String },
    profile_pic_url: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser & Document>('User', UserSchema);
