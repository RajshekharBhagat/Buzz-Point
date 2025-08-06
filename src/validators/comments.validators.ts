
import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.string(),
  parentCommentId: z.string().optional(),
});

export const getCommentSchema = z.object({
  postId: z.string(),
  page: z.string().transform((val) => parseInt(val) || 1),
  limit: z.string().transform((val) => parseInt(val) || 10),
});
