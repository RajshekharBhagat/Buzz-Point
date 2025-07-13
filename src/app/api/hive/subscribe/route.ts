import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { HiveSubscriptionValidator } from "@/lib/validators/hive";
import SubscriptionModel from "@/models/Subscription.model";
import { z } from "zod";

export async function POST(req: Request) {
    try {

        const session = await getAuthSession();

        if(!session || !session.user) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Unauthorized',
            }),{
                status: 401
            });
        }

        const body = await req.json();
        const {hiveId} = HiveSubscriptionValidator.parse(body);
        await dbConnect();
        const subscriptionExist = await SubscriptionModel.findOne({
            hive: hiveId,
            user: session.user.id.toString(),
        });

        if(subscriptionExist) {
            return new Response(JSON.stringify({
                success: false,
                message: 'You are already subscribed to this subreddit.',
            }),{status: 409})
        }

        const subscribe = new SubscriptionModel({
            hive: hiveId,
            user: session.user.id,
        })
        await subscribe.save();
        return new Response(JSON.stringify({
            success: true,
            message: `Subscribed Successfully`,
        }),{status: 201})

    } catch (error) {
        if(error instanceof z.ZodError) {
            return new Response (JSON.stringify({
                success: false,
                message: error.errors,
            }),{status: 422})
        }
        return new Response(JSON.stringify({
            success: false,
            message: 'Something went wrong. Please try again.',
        }),{status: 500})
    }
}