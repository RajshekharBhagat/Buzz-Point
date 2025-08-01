import { Document } from "mongodb";
import mongoose, { Schema, Types } from "mongoose";
import './User.model';
import './Post.model';

export interface SavedPost extends Document {
    user: Types.ObjectId,
    post: Types.ObjectId,
}


const savedPostSchema = new Schema<SavedPost>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    }
},{timestamps: true})

const SavedPostModel = mongoose.models.SavedPost || mongoose.model<SavedPost>("SavedPost", savedPostSchema);

export default SavedPostModel;