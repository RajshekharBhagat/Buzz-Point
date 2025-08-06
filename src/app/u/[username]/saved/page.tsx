import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import PostFeed from '@/components/PostFeed';
import { getAuthSession } from '@/lib/auth';

const Page = () => {
  
  return (
    <div className='relative my-10'>
      <h1 className='text-xl md:text-xl font-semibold mb-5'>Saved Posts</h1>
      <PostFeed type='saved' />
    </div>
  )
}

export default Page