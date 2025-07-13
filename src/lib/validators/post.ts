import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 characters" })
    .max(128, { message: "Title must be at least 128 characters" }),
  hiveId: z.string(),
  content: z.any(),
});

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(['upVote','downVote']),
});

export const PostCommentValidator = z.object({
  commentId: z.string(),
  comment: z.string(),
})

export type PostCommentRequestType = z.infer<typeof PostCommentValidator>;
export type PostVoteRequestType = z.infer<typeof PostVoteValidator>;
export type PostCreationRequestType = z.infer<typeof PostValidator>;
