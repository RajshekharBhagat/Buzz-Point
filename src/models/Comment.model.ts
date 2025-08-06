import mongoose, { Document, Schema } from "mongoose";
import { User } from "./User.model";

export interface Comment extends Document {
  _id: Schema.Types.ObjectId;
  content: string;
  author: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  parentComment?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtendedComments extends Document {
    author: Pick<User,'_id' | 'username' | 'name' | 'image'>;
    replies: ExtendedComments[];
    likeCount: number;
    userLike?: 'like' | null;
    replyCount: number;
}

export const CommentSchema = new Schema<Comment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({post: 1, parentComment: 1, createdAt: -1});
CommentSchema.index({author: 1});


const CommentModel =
  mongoose.models.Comment || mongoose.model<Comment>("Comment", CommentSchema);
export default CommentModel;

