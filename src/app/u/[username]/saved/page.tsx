import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import PostFeed from '@/components/PostFeed';
import { getAuthSession } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import PostModel, { ExtendedPost } from '@/models/Post.model';
import SavedPostModel from '@/models/SavedPost.model';
import React from 'react'

const Page = async ({params}:{params: Promise<{username: string}>}) => {
  const session = await getAuthSession();
  const {username} = await params;
  await dbConnect();
  const savedPostIds = await SavedPostModel.find({user: session?.user.id}).select('post');
  const initialPosts = await PostModel.find<ExtendedPost>({
    _id : {
      $in: savedPostIds.map((postId) => postId.post)
    }})
    .populate("author")
    .populate("comments")
    .populate("hive")
    .lean();
  return (
    <MaxWidthWrapper className='relative my-10'>
      <h1 className='text-xl md:text-xl font-semibold mb-5'>Saved Posts</h1>
      <PostFeed initialPost={JSON.parse(JSON.stringify(initialPosts))}  />
    </MaxWidthWrapper>
  )
}

export default Page