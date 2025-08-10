"use client";
import { useInfinitePosts } from "@/hooks/use-post";
import { useIntersection } from "@mantine/hooks";
import { FrownIcon, Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import PostComponent from "./PostComponent";
import { Button, buttonVariants } from "./ui/button";
import PostSkeleton from "./PostSkeleton";

interface PostFeedProps {
  type?: 'feed' | 'hive' | 'user-posts' | 'saved',
  hiveName?:string,
  username?: string,
  fields?: string,
}

const PostFeed = ({ type='feed',hiveName,username,fields='hive,author,comments'}: PostFeedProps) => {
  
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  const {
    data,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfinitePosts({ type, hiveName, username, fields });

  const posts = data?.pages.flatMap((page) => page) ?? [];

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-full p-6 bg-white  rounded-xl shadow-md shadow-black/20">
        <div className="flex items-center gap-4 mb-4">
        <FrownIcon className="text-green-400 size-20" />
        <span className="flex flex-col max-w-sm">
          <h1 className="text-green-400 text-2xl font-semibold">Sorry for the inconvenience</h1>
          <p className="text-gray-700 text-sm">We are trying hard to solve the issue. Please try after sometime.</p>
        </span>
        </div>
          <Button 
            onClick={() => refetch()} 
            className={buttonVariants({variant:'default'})}
          >
            Try again
          </Button>
      </div>
    );
  }

  if(isLoading) {
    return <PostSkeleton />
  }

  if (!isLoading && posts.length === 0) {
    const getEmptyMessage = () => {
      switch (type) {
        case 'hive':
          return `No posts found in h/${hiveName}`;
        case 'saved':
          return "You haven't saved any posts yet";
        case 'user-posts':
          return `No posts found for u/${username}`;
        default:
          return "No posts found";
      }
    };
    return (
      <div className="col-span-2 flex justify-center items-center p-8">
        <p className="text-gray-500 text-center">{getEmptyMessage()}</p>
      </div>
    );
  }


  return (
    <ul>
      {posts.map((post, index) => {
        const isLastPost = index === posts.length - 1;
        return (
          <li key={post._id.toString()} ref={isLastPost ? ref : null}>
            <PostComponent
              post={post}
              hiveName={hiveName ? hiveName : post.hive.name}
              commentAmt={post.comments.length}
            />
          </li>
        );
      })}
      {isFetchingNextPage && (
       <PostSkeleton />
      )}
      {isLoading && posts.length === 0 && (
        <li className="flex justify-center p-4">
          <Loader2Icon className="size-14 text-green-400 animate-spin" />
        </li>
      )}
    </ul>
  );
};

export default PostFeed;
