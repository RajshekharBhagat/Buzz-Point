import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import "@/models/Comment.model";
import HiveModel from "@/models/Hives.model";
import PostModel from "@/models/Post.model";
import SavedPostModel, { SavedPost } from "@/models/SavedPost.model";
import SubscriptionModel, { Subscription } from "@/models/Subscription.model";
import UserModel from "@/models/User.model";
import { ZodError, z } from "zod";

// export async function GET(req: Request) {
//   await dbConnect();
//   try {
//     const url = new URL(req.url);
//     const session = await getAuthSession();
//     let followedCommunitiesIds: string[] = [];
//     if (session) {
//       const followedCommunities = await SubscriptionModel.find<Subscription>({
//         user: session.user.id,
//       });
//       followedCommunitiesIds = followedCommunities.map((com) =>
//         com.hive.toString()
//       );
//     }
//     const { limit, page, hiveName } = z
//       .object({
//         limit: z.string(),
//         page: z.string(),
//         hiveName: z.string().nullish().optional(),
//       })
//       .parse({
//         limit: url.searchParams.get("limit"),
//         page: url.searchParams.get("page"),
//         hiveName: url.searchParams.get("hiveName"),
//       });

//     const whereClause: any = {};
//     if (hiveName) {
//       const hive = await HiveModel.findOne({ name: hiveName }).select("_id");
//       if (!hive) {
//         return new Response(
//           JSON.stringify({
//             success: false,
//             message: "Hive not found",
//           }),
//           { status: 404 }
//         );
//       }
//       whereClause.hive = hive._id;
//     } else if (session && followedCommunitiesIds.length > 0) {
//       whereClause.hive = { $in: followedCommunitiesIds };
//     }
//     const posts = await PostModel.find(whereClause)
//       .populate("hive")
//       .populate("author")
//       .populate("comments")
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit))
//       .skip((parseInt(page) - 1) * parseInt(limit))
//       .lean();
//     return new Response(
//       JSON.stringify({
//         success: true,
//         posts: posts,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("Failed to fetch post: ", error);
//     if (error instanceof ZodError) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: "Invalid input",
//         }),
//         { status: 422 }
//       );
//     }
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: "Something went wrong while fetching posts.",
//       }),
//       { status: 500 }
//     );
//   }
// }

const querySchema = z.object({
  limit: z
    .string()
    .nullable()
    .transform((val) => Math.min(parseInt(val || "10"), 50)),
  page: z
    .string()
    .nullable()
    .transform((val) => Math.max(parseInt(val || "1"), 1)),
  type: z
    .union([
      z.literal("feed"),
      z.literal("hive"),
      z.literal("saved"),
      z.literal("user-posts"),
    ])
    .optional()
    .default("feed"),
  hiveName: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  fields: z.string().nullable().optional(),
});

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    console.log("Received URL: ", url);
    const session = await getAuthSession();

    const { limit, page, type, fields, hiveName, username } = querySchema.parse(
      {
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        type: url.searchParams.get("type"),
        hiveName: url.searchParams.get("hiveName"),
        username: url.searchParams.get("username"),
        fields: url.searchParams.get("fields"),
      }
    );

    const whereClause: any = {};
    
    switch (type) {
      case "hive":
        if (!hiveName) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Hive Name is required for hive posts.",
            }),
            { status: 400 }
          );
        }
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
        break;
      case "saved":
        if (!session) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Authentication required for saved posts.",
            }),
            { status: 401 }
          );
        }
        const savedPosts = await SavedPostModel.find<SavedPost>({
          user: session.user.id,
        }).select("post");
        if (!savedPosts || !savedPosts.length) {
          return new Response(
            JSON.stringify({
              success: true,
              posts: [],
            }),
            { status: 200 }
          );
        }
        whereClause._id = {
          $in: [
            ...savedPosts.map((savedPost) => savedPost.post._id.toString()),
          ],
        };
        break;
      case "user-posts":
        if (!username) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Username is required for user's posts",
            }),
            { status: 400 }
          );
        }
        const targetUser = await UserModel.findOne({
          username: username,
        }).select("_id");
        if (!targetUser) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "User not found",
            }),
            { status: 404 }
          );
        }
        whereClause.author = targetUser._id;
        break;
      case "feed":
      default:
        if (session) {
          const followedCommunities =
            await SubscriptionModel.find<Subscription>({
              user: session.user._id,
            });
          const followedCommunitiesIds = followedCommunities.map((com) =>
            com.hive.toString()
          );
          if (followedCommunitiesIds.length > 0) {
            whereClause.hive = { $in: followedCommunitiesIds };
          }
        }
        break;
    }
    let query = PostModel.find(whereClause);

    const defaultFields = ["hive", "author"];
    const fieldsToPopulate = fields ? fields.split(",") : defaultFields;

    fieldsToPopulate.forEach((field) => {
      switch (field.trim()) {
        case "hive":
          query = query.populate("hive", " _id name description");
          break;
        case "author":
          query = query.populate("author", "_id name username email image");
          break;
        case "comments":
          //TODO:
          break;
      }
    });

    const posts = await query
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    return new Response(
      JSON.stringify({
        success: true,
        posts: posts,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch posts: ", error);

    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid input parameters",
          errors: error.errors,
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
