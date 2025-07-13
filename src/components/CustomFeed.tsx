import { getAuthSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import PostModel, { ExtendedPost } from "@/models/Post.model";
import SubscriptionModel from "@/models/Subscription.model";
import React from "react";
import PostFeed from "./PostFeed";

const CustomFeed = async () => {
  const session = await getAuthSession();
  await dbConnect();
  const followedCommunities = await SubscriptionModel.find({
    user: session?.user.id,
  }).select("hive");
  const posts = await PostModel.find<ExtendedPost[]>({
    hive: { $in: followedCommunities.map((community) => community.hive) },
  })
    .populate("author")
    .populate("comments")
    .populate("hive")
    .lean();
  console.log(posts);
  return <PostFeed initialPost={JSON.parse(JSON.stringify(posts))} />;
};

export default CustomFeed;
