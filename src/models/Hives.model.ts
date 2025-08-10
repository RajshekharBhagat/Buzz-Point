import mongoose, { Document, Schema, Types } from "mongoose";


export interface Hive extends Document {
    _id: string;
    name: string;
    description?: string;
    creator: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    upVotes: number,
    downVotes: number,
}

export const HiveSchema = new Schema<Hive> (
    {
        name: {
            type: String, 
            required: true, 
            unique: true,
        },
        description: {
            type: String,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        upVotes: {
            type: Number,
            default: 0,
        },
        downVotes: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true
    },
);

const HiveModel = mongoose.models.Hive || mongoose.model<Hive>("Hive",HiveSchema);
export default HiveModel;