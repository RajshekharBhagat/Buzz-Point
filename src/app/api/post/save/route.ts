import { getAuthSession } from "@/lib/auth";
import PostModel from "@/models/Post.model";
import SavedPostModel from "@/models/SavedPost.model";

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const postId = url.searchParams.get('postId');
        if(!postId) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Post ID is required.",
               }),
               { status: 422 }
            );
        }
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
        const post = await PostModel.findById(postId).select('_id')
        if(!post) {
            return new Response (
                JSON.stringify({
                    success: false,
                    message: "Post not found.",
                }),
                {status: 404},
            );
        }

        const savedPost = new SavedPostModel({
            user: session.user.id,
            post: post._id,
        })
        await savedPost.save();
        return new Response(
           JSON.stringify({
              success: true,
              message: "Post Saved",
           }),
           { status: 201 }
        );
    } catch (error) {
        console.error('Something went wrong while saving the post: ', error);
        return new Response(
           JSON.stringify({
              success: false,
              message: "Something went wrong.",
           }),
           { status: 500 }
        );
    }
}