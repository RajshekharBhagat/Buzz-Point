import dbConnect from "@/lib/dbConnect";
import SubscriptionModel, { Subscription } from "@/models/Subscription.model";

export async function GET(req: Request){
    try {
        await dbConnect();
        const topHives = await SubscriptionModel.aggregate<Subscription>([
            {
              $group: {
                _id: "$hive",
                subscriberCount: { $sum: 1 },
              },
            },
            {
              $sort: { subscriberCount: -1 },
            },
            {
              $limit: 10,
            },
            {
              $lookup: {
                from: "hives",
                localField: "_id",
                foreignField: "_id",
                as: "hiveDetails",
              },
            },
            {
              $unwind: "$hiveDetails",
            },
            {
              $project: {
                _id: "$hiveDetails._id",
                name: "$hiveDetails.name",
                description: "$hiveDetails.description",
                image: "$hiveDetails.image", // optional
                subscriberCount: 1,
              },
            },
          ]);
        return new Response(
           JSON.stringify({
              success: true,
              data: topHives,
           }),
           { status: 200 }
        );
    } catch (error) {
        console.log("Failed to fetch top Hives: ", error);
        return new Response(
           JSON.stringify({
              success: false,
              message: "Something went wrong while fetching top hives.",
           }),
           { status: 500 }
        );
    }
}