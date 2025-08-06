import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CommentModel, { Comment } from "@/models/Comment.model";
import CommentLikeModel from "@/models/CommentLike.model";
import { getCommentSchema } from "@/validators/comments.validators";

type PopulatedComment = Omit<Comment, "author"> & {
  author: {
    _id: string;
    name: string;
    username: string;
    image: string;
  };
  likeCount: number;
  userLike: string | null;
  replyCount: number;
  replies: PopulatedComment[];
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parsed = getCommentSchema.safeParse({
      postId: url.searchParams.get("postId"),
      page: url.searchParams.get("page"),
      limit: url.searchParams.get("limit"),
    });

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid Input",
        }),
        { status: 422 }
      );
    }
    const { postId, limit, page } = parsed.data;
    await dbConnect();
    const session = await getAuthSession();
    const skip = (page - 1) * limit;

    const topLevelComment = await CommentModel.find({
      post: postId,
      parentComment: null,
    })
      .populate("author", "_id name username image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const commentWithReplies = await Promise.all(
      topLevelComment.map(async (comment) => {
        const extendedComment = await populateCommentData(
          comment,
          session?.user.id
        );
        return extendedComment;
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: commentWithReplies,
        pagination: {
          page,
          limit,
          hasMore: topLevelComment.length === limit,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch comments: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch comments",
      }),
      { status: 500 }
    );
  }
}

async function populateCommentData(
  comment: any,
  userId?: string
): Promise<PopulatedComment> {
  const likeCount = await CommentLikeModel.countDocuments({
    comment: comment._id,
    type: "like",
  });

  let userLike = null;
  if (userId) {
    const userLikeDoc = await CommentLikeModel.findOne({
      user: userId,
      comment: comment._id,
    });
    userLike = userLikeDoc?.type || null;
  }

  const replyCount = await CommentModel.countDocuments({
    parentComment: comment._id,
  });

  const replies = await CommentModel.find({
    parentComment: comment._id,
  })
    .populate("author", "_id name username image")
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const populatedReplies = await Promise.all(
    replies.map(async (reply) => {
      return await populateCommentData(reply, userId);
    })
  );

  return {
    ...comment,
    likeCount,
    userLike,
    replyCount,
    replies: populatedReplies,
  };
}
