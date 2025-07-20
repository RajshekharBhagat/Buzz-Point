import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/Post.model";

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    if (!postId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Post id is required",
        }),
        { status: 422 }
      );
    }
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
    await dbConnect();
    const post = await PostModel.findOne({ _id: postId });
    if (!post) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Post with the ID ${postId} is not found.`,
        }),
        { status: 404 }
      );
    }
    const canDelete = post.author.toString() === session.user.id;
    if (!canDelete) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You are not authorized to delete this post.",
        }),
        { status: 403 }
      );
    }

    const imageUrls: string[] = [];
    if (post.content && Array.isArray(post.content.blocks)) {
      for (const block of post.content.blocks) {
        if (block.type === "image" && block.data?.file?.url) {
          imageUrls.push(block.data.file.url);
        }
      }
    }

    await Promise.all(
      imageUrls.map(async (url) => {
        try {
          const imageKey = url.split("/f/")[1];
          await fetch("https://uploadthings.com/api/deleteFile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.UPLOADTHING_SECRET}`,
            },
            body: JSON.stringify({ fileKey: imageKey }),
          });
        } catch (error) {
          console.warn("Failed to delete the image from uploadThing", error);
        }
      })
    );
    await PostModel.findByIdAndDelete(postId, { new: true });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Post deleted.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Something went wrong while deleting the post: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Something went wrong.",
      }),
      { status: 500 }
    );
  }
}
