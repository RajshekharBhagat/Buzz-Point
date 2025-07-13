import { Document } from "mongodb";
import mongoose, { Schema, Types } from "mongoose";

export interface Vote extends Document {
    user: Types.ObjectId;
    post: Types.ObjectId;
    type: 'upVote' | 'downVote';
    createdAt: Date;
    updatedAt: Date;
};

const VoteSchema = new Schema<Vote>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    type: {
        type: String,
        enum: ['upVote','downVote'],
        required: true,
    },
    
},{timestamps: true})

const VoteModel = mongoose.models.Vote || mongoose.model<Vote>('Vote',VoteSchema);
export default VoteModel;