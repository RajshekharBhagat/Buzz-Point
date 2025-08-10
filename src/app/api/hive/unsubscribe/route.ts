import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import SubscriptionModel from "@/models/Subscription.model";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized Request",
        }),
        { status: 401 }
      );
    }
    const {hiveId} = await req.json();
    if(!hiveId) {
      return new Response(
         JSON.stringify({
            success: false,
            message: "Hive ID is required.",
         }),
         { status: 422 }
      );
    }
    await dbConnect();
    const existingSubscription = await SubscriptionModel.findOne({
      hive: hiveId,
      user: session.user.id,
    });
    if (!existingSubscription) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You are not subscribed to this hive.",
        }),
        { status: 400 }
      );
    }
    await SubscriptionModel.deleteOne({
      hive: hiveId,
      user: session.user.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "You are new Unsubscribed to the hive.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(`Something went wrong while unsubscribing: ${error}`);
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.errors,
        }),
        { status: 422 }
      );
    }
    return new Response(
      JSON.stringify({
        success: false,
        message: "Something went wrong. Please try again later.",
      }),
      { status: 500 }
    );
  }
}
