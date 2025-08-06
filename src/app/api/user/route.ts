import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const username = url.searchParams.get('username');
        if(!username) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Invalid Input",
               }),
               { status: 422 }
            );
        }
        await dbConnect();
        const result = await UserModel.aggregate([
         {
            $match: {username}
         },
         {
            $lookup: {
               from : "posts",
               let: {userId: '$_id'},
               pipeline: [
                  { $match: {$expr: { $eq: ["$author","$$userId"]}}},
                  { $count: "count"}
               ],
               as: "postsCount",
            }
         },
         {
            $lookup: {
               from: "comments",
               let: {userId: "$_id"},
               pipeline: [
                  {$match: {$expr: { $eq: ["$author","$$userId"]}}},
                  {$count: "count"},
               ],
               as: "commentsCount",
            }
         },
         {
            $lookup: {
               from : "savedposts",
               let: {userId: "$_id"},
               pipeline: [
                  {$match: {$expr: {$eq: ["$user","$$userId"]}}},
                  {$count: "count"}
               ],
               as: "savedCount",
            }
         }, 
         {
            $project: {
               name: 1,
               username: 1,
               image: 1, 
               createdAt: 1,
               totalPosts: {$ifNull: [{$arrayElemAt: ["$postsCount.count", 0]}, 0]},
               totalComments: {$ifNull: [{$arrayElemAt: ["$commentsCount.count", 0]}, 0]},
               totalSaved: {$ifNull: [{$arrayElemAt: ["$savedCount.count", 0]}, 0]},
            }
         }
        ]);
        return new Response(
           JSON.stringify({
              success: true,
              data: result[0],
           }),
           { status: 200 }
        );
    } catch (error) {
        console.error("Failed to fetch user: ", error);
        return new Response(
           JSON.stringify({
              success: false,
              message: "Something went wrong while fetching user",
           }),
           { status: 500 }
        );
    }
}