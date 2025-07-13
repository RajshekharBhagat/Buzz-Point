import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/Post.model";

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const postId = url.searchParams.get('postId');
        if(!postId) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Post id is required",
               }),
               { status: 422 }
            );
        }
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
        const post = await PostModel.findOne({_id: postId});
        if(!post ) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: `Post with the ID ${postId} is not found.`,
               }),
               { status: 404 }
            );
        }
        const canDelete = post.author.toString() === session.user._id;
        if(!canDelete) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "You are not authorized to delete this post.",
               }),
               { status: 403 }
            );
        }
        await PostModel.findByIdAndDelete(postId,{new: true});
        return new Response(
           JSON.stringify({
              success: true,
              message: "Post deleted.",
           }),
           { status: 200 }
        );
    } catch (error) {
        console.error("Something went wrong while deleting the post: ",error);
        return new Response(
           JSON.stringify({
              success: false,
              message: "Something went wrong.",
           }),
           { status: 500 }
        );
    }
}