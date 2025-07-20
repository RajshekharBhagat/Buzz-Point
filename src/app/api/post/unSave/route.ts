import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/Post.model";
import SavedPostModel from "@/models/SavedPost.model";

export async function DELETE(req: Request) {
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
        const url = new URL(req.url);
        const postId = url.searchParams.get('postId');
        if(!postId) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "postId is not found.",
               }),
               { status: 422 }
            );
        }
        await dbConnect();
        const post = await PostModel.findById(postId).select('_id');
        if(!post) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Post not found",
               }),
               { status: 404 }
            );
        }
        await SavedPostModel.findOneAndDelete({
            user: session.user.id,
            post: postId,
        })
        return new Response(
           JSON.stringify({
              success: true,
              message: "Post Unsaved.",
           }),
           { status: 200 }
        );
    } catch (error) {
        console.log("Something went wrong while UnSaving the post: ", error);
        return new Response(
           JSON.stringify({
              success: false,
              message: "Something went wrong.",
           }),
           { status: 500 }
        );
    }
}