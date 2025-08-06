import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import CommentLikeModel from "@/models/CommentLike.model";

export async function POST(req: Request) {
    await dbConnect();
    try {
      const session = await getAuthSession();
      if (!session) {
        return Response.json({
          success: false,
          message: "Authentication required"
        }, { status: 401 });
      }
  
      const { commentId } = await req.json();
  
      const existingLike = await CommentLikeModel.findOne({
        user: session.user.id,
        comment: commentId
      });
  
      if (existingLike) {
        await CommentLikeModel.deleteOne({
          user: session.user.id,
          comment: commentId
        });
        
        return Response.json({
          success: true,
          action: 'un-liked'
        });
      } else {
        await CommentLikeModel.create({
          user: session.user.id,
          comment: commentId,
          type: 'like'
        });
        
        return Response.json({
          success: true,
          action: 'liked'
        });
      }
  
    } catch (error) {
      console.error("Error toggling comment like:", error);
      return Response.json({
        success: false,
        message: "Failed to toggle like"
      }, { status: 500 });
    }
  }