import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '@/models/User';

export interface IBlog {
  title: string;
  sub_title: string;
  content: string;
  slug: string;
  tags: string[];
  author: mongoose.Types.ObjectId | IUser;
  created_date: Date;
  modified_date: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    sub_title: { type: String },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' },
  }
);

export default mongoose.model<IBlog & Document>('Blog', BlogSchema);
