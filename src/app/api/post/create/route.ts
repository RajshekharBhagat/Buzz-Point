import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { PostValidator } from "@/lib/validators/post";
import PostModel from "@/models/Post.model";
import SubscriptionModel from "@/models/Subscription.model";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if(!session || !session.user) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Unauthorized Request",
               }),
               { status: 401 }
            );
        }
        await dbConnect();
        const body = await req.json();
        const {title,content,hiveId} = PostValidator.parse(body);
        const subscriptionExist = await SubscriptionModel.findOne({
            user: session.user.id,
            hive: hiveId,
        });

        if(!subscriptionExist) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Subscribe the hive to post.",
               }),
               { status: 400 }
            );
        }

        const post = new PostModel({
            title: title,
            content: content,
            author: session.user.id,
            hive: hiveId,
        })
        await post.save();

        return new Response(
           JSON.stringify({
              success: true,
              message: "Post created.",
           }),
           { status: 201 }
        );

    } catch (error) {
        console.log(error);
        if(error instanceof z.ZodError) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Invalid post creation data passed",
               }),
               { status: 422 }
            );
        }
        return new Response(
           JSON.stringify({
              success: false,
              message: "Something went wrong.",
           }),
           { status: 500 }
        );
    }
}