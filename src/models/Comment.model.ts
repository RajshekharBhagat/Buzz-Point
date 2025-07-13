import mongoose, {Document, Schema} from 'mongoose';

export interface Comment extends Document {
    _id: Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
    author: Schema.Types.ObjectId;
    post: Schema.Types.ObjectId;
    parentComment?: Schema.Types.ObjectId;
    // replies?: Schema.Types.ObjectId[];
    upVote: number,
    downVote: number,
};

export const CommentSchema = new Schema<Comment>(
    {
        text: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: null
        },
        // replies: [{
        //     type: Schema.Types.ObjectId,
        //     ref: 'Comment',
        // }],
        upVote: {
            type: Number,
            default: 0,
        },
        downVote: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

CommentSchema.virtual('replies', {
    ref: "Comment",
    localField: "_id",
    foreignField: "parentComment",
});

CommentSchema.set('toObject',{virtuals: true});
CommentSchema.set("toJSON",{virtuals: true});

const CommentModel = mongoose.models.Comment || mongoose.model<Comment>('Comment',CommentSchema);
export default CommentModel;