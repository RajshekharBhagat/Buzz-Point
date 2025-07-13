import { Document } from "mongodb";
import mongoose, { Schema, Types } from "mongoose";

export interface Subscription extends Document {
    user: Types.ObjectId;
    hive: Types.ObjectId;
    createdAt: Date,
};

const SubscriptionSchema = new Schema<Subscription> (
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        hive: {
            type: Schema.Types.ObjectId,
            ref: 'Hive',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

SubscriptionSchema.index({user: 1, hive: 1},{unique: true});

const SubscriptionModel = mongoose.models.Subscription || mongoose.model<Subscription>('Subscription', SubscriptionSchema);
export default SubscriptionModel;