import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { PostVoteValidator } from "@/lib/validators/post";
import VoteModel, { Vote } from "@/models/Vote.model";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const session = await getAuthSession();
        if(!session) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: "Unauthorized Request",
               }),
               { status: 401 }
            );
        }
        const body = await req.json();
        const {postId,voteType} = PostVoteValidator.parse(body);
        const existingVote = await VoteModel.findOne<Vote>({post: postId, user: session.user.id});
        if(existingVote) {
            if(existingVote.type === voteType) {
                await VoteModel.deleteOne({_id: existingVote._id});
                return new Response(
                   JSON.stringify({
                      success: true,
                      message: "Vote removed.",
                   }),
                   { status: 200 }
                );
            } else {
                existingVote.type = voteType;
                await existingVote.save();
                return new Response(
                   JSON.stringify({
                      success: true,
                      message: "Vote updated",
                   }),
                   { status: 200 }
                );
            }
        } else {
            const newVote = new VoteModel({
                post: postId,
                user: session.user.id,
                type: voteType,
            });
            await newVote.save();
            return new Response(
               JSON.stringify({
                  success: true,
                  message: "Vote Added.",
               }),
               { status: 200 }
            );
        }
    } catch (error) {
        console.error('There is an Error updating vote: ',error);
        if(error instanceof z.ZodError) {
            return new Response(
               JSON.stringify({
                  success: false,
                  message: error.message,
               }),
               { status: 422 }
            );
        }
    }
    return new Response(
       JSON.stringify({
          success: false,
          message: "Something went wrong. Please try again.",
       }),
       { status: 500 }
    );
}

export async function GET(req: Request) {
    try {
        const session = await getAuthSession();
        if(!session) {
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
                  message: "postId is required.",
               }),
               { status: 400 }
            );
        }
        const votes = await VoteModel.find<Vote>({post: postId});
        return new Response(
           JSON.stringify({
              success: true,
              data:votes,
           }),
           { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching votes: ', error);
        return new Response(
           JSON.stringify({
              success: false,
              message: "Failed to Fetch Votes.",
           }),
           { status: 500 }
        );
    }
}