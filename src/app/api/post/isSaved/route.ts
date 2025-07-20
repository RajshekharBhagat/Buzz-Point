import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import SavedPostModel from "@/models/SavedPost.model";

export async function GET(req: Request) {
    try {
        const session = await getAuthSession();
        if(!session || !session.user) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Unauthorized Request.",
               }),
               { status: 401 }
            );
        }
        const url = new URL(req.url);
        const postId = url.searchParams.get('postId');
        if(!postId) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Post ID in not found.",
               }),
               { status: 422 }
            );
        }
        await dbConnect();
        const savedPost = await SavedPostModel.findOne({
            user: session.user.id,
            post: postId,
        })
        return new Response(
           JSON.stringify({
              success: true,
              isSaved: !!savedPost,
           }),
           { status: 200 }
        );
    } catch (error) {
        console.error("Failed to fetch isSaved: ", error);
        return new Response(
           JSON.stringify({
              success: false,
              message: "Something went wrong",
           }),
           { status: 500 }
        );
    }
}