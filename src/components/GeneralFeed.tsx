import PostModel, { ExtendedPost } from "@/models/Post.model";
import React from "react";
import PostFeed from "./PostFeed";
import dbConnect from "@/lib/dbConnect";

const GeneralFeed = async () => {
  await dbConnect();
  const posts = await PostModel.find<ExtendedPost[]>()
    .sort({ createdAt: -1 })
    .populate("author")
    .populate("comments")
    .populate("hive")
    .lean();
  return <PostFeed initialPost={JSON.parse(JSON.stringify(posts))} />;
};

export default GeneralFeed;
