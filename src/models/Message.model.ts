import mongoose, { Document, Schema, Types } from "mongoose";

export interface Message extends Document {
    hive: Types.ObjectId,
    user: Types.ObjectId,
    content: string,
    createdAt: string,
};

const messageSchema = new Schema<Message>({
    hive: {
        type: Schema.Types.ObjectId,
        ref: 'Hive',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

},{timestamps: true});

const MessageModel = mongoose.models.Message || mongoose.model<Message>('Message',messageSchema);
export default MessageModel;