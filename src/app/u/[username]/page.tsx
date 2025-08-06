import PostFeed from '@/components/PostFeed';
import React from 'react'

const Page = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  return (
    <div className='relative'>
      <h1 className='md:text-lg font-semibold mb-5'>{`/u/${username} Posts`}</h1>
      <PostFeed type='user-posts' username={username} />
    </div>
  )
}

export default Page