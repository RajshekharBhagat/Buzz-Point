import mongoose, { Types, Schema, Document } from "mongoose";
import './Comment.model'
import './Hives.model'
import { User } from "./User.model";
import { Comment } from "./Comment.model";
import { Hive } from "./Hives.model";

export type ExtendedPost = Post & {
  author: User,
  comments: Comment[],
  hive: Hive,
}

export interface Post extends Document {
  _id: Types.ObjectId;
  title: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
  hive: Types.ObjectId;
  author: Types.ObjectId;
  comments: Types.ObjectId[];
}

export const PostSchema = new Schema<Post>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    hive: {
      type: Schema.Types.ObjectId,
      ref: "Hive",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PostModel =
  mongoose.models.Post || mongoose.model<Post>("Post", PostSchema);
export default PostModel;
