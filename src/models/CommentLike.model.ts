import mongoose, { Document, Schema, Types } from "mongoose";

export interface CommentLike extends Document {
    _id: Types.ObjectId,
    user: Types.ObjectId,
    comment: Types.ObjectId,
    type: 'like';
    createdAt: Date;
}

const CommentLikeSchema = new Schema<CommentLike>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
    },
    type: {
        type: String,
        enum: ['like'],
        default: 'like',
    }

},{timestamps: true});

CommentLikeSchema.index({user: 1, comment: 1},{unique: true});

const CommentLikeModel = mongoose.models.CommentLike || mongoose.model<CommentLike>('CommentLike',CommentLikeSchema);
export default CommentLikeModel;