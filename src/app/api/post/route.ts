import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import "@/models/Comment.model";
import HiveModel from "@/models/Hives.model";
import PostModel from "@/models/Post.model";
import SubscriptionModel, { Subscription } from "@/models/Subscription.model";
import { ZodError, z } from "zod";

export async function GET(req: Request) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const session = await getAuthSession();
    let followedCommunitiesIds: string[] = [];
    if (session) {
      const followedCommunities = await SubscriptionModel.find<Subscription>({
        user: session.user.id,
      });
      followedCommunitiesIds = followedCommunities.map((com) =>
        com.hive.toString()
      );
    }
    const { limit, page, hiveName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        hiveName: z.string().nullish().optional(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        hiveName: url.searchParams.get("hiveName"),
      });

    const whereClause: any = {};
    if (hiveName) {
      const hive = await HiveModel.findOne({ name: hiveName }).select("_id");
      if (!hive) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Hive not found",
          }),
          { status: 404 }
        );
      }
      whereClause.hive = hive._id;
    } else if (session && followedCommunitiesIds.length > 0) {
      whereClause.hive = { $in: followedCommunitiesIds };
    }
    const posts = await PostModel.find(whereClause)
      .populate("hive")
      .populate("author")
      .populate("comments")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();
    return new Response(
      JSON.stringify({
        success: true,
        posts: posts,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch post: ", error);
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid input",
        }),
        { status: 422 }
      );
    }
    return new Response(
      JSON.stringify({
        success: false,
        message: "Something went wrong while fetching posts.",
      }),
      { status: 500 }
    );
  }
}
