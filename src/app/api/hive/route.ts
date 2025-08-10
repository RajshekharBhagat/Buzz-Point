import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import HiveModel from "@/models/Hives.model";
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const hiveName = url.searchParams.get("hiveName");
    const session = await getAuthSession();
    const userId = session?.user.id;
    if (!hiveName) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Hive name is required",
        }),
        { status: 422 }
      );
    }
    await dbConnect();
    const hiveId = await HiveModel.findOne({name: hiveName}).select('_id');
    const pipeline = [
        {
          $match: { name: hiveName },
        },
        {
          $lookup: {
            from: "subscriptions",
            let: { hiveId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$hive", "$$hiveId"] } } },
              { $count: "count" },
            ],
            as: "subscribersCount",
          },
        },
        {
          $addFields: {
            subscribersCount: {
              $cond: {
                if: { $gt: [{ $size: "$subscribersCount" }, 0] },
                then: { $arrayElemAt: ["$subscribersCount.count", 0] },
                else: 0,
              },
            },
          },
        },
        ...(userId
          ? [
              {
                $lookup: {
                  from: "subscriptions",
                  let: { hiveId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$hive", "$$hiveId"] },
                            { $eq: ["$user", { $toObjectId: userId }] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "userSubscriptions",
                },
              },
              {
                $addFields: {
                  isSubscribed: { $gt: [{ $size: "$userSubscriptions" }, 0] },
                  isCreator: {
                    $eq: ["$creator", { $toObjectId: userId }],
                  },
                },
              },
            ]
          : [
              {
                $addFields: {
                  isSubscribed: false,
                  isCreator: false,
                },
              },
            ]),
        {
          $project: {
            _id: 1,
            name: 1,
            creator: 1,
            createdAt: 1,
            subscribersCount: 1,
            isSubscribed: 1,
            isCreator: 1,
          },
        },
      ];
    const result = await HiveModel.aggregate(pipeline);
    if (!result || result.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Hive not found.",
        }),
        { status: 404 }
      );
    }
    const hiveDetails = result[0];
    return new Response(
      JSON.stringify({
        success: true,
        data: hiveDetails,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch hive: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Something went wrong while fetching hive.",
      }),
      { status: 500 }
    );
  }
}
