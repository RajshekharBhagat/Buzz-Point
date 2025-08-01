"use client";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/models/Post.model";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import PostComponent from "./PostComponent";
import { Loader2Icon } from "lucide-react";

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

  const getQueryKey = () => {
    const baseKey = ['infinite-posts'];
    switch(type) {
      case 'hive':
        return [...baseKey,'hive',hiveName];
      case 'saved':
        return [...baseKey, 'saved'];
      case 'user-posts':
        return [...baseKey, 'user-posts',username];
      case 'feed':
        default:
          return [...baseKey,'feed']
    }
  }

  const buildQueryString = (pageParam: number) => {
    const params = new URLSearchParams({
      limit: INFINITE_SCROLLING_PAGINATION_RESULTS.toString(),
      page: pageParam.toString(),
      type,
      fields,
    });

    if(type === 'hive' && hiveName) {
      params.append('hiveName', hiveName);
    }
    if(type === 'user-posts' && username) {
      params.append('username',username);
    }
    return `/api/post?${params.toString()}`
  };



  const { data,error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: getQueryKey(),
      queryFn: async ({ pageParam = 1 }) => {
        const query = buildQueryString(pageParam);
        const { data: response } = await axios.get(query);
        return response.posts as ExtendedPost[];
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage,pages) => {
        if(lastPage.length < INFINITE_SCROLLING_PAGINATION_RESULTS) {
          return undefined;
        }
        return pages.length + 1;
      },
      refetchOnWindowFocus: type === 'saved',
      staleTime: type === 'saved' ? 0 : 5 * 60 * 1000,
    });

    useEffect(() => {
      if(entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },[entry,fetchNextPage,hasNextPage,isFetchingNextPage])

  const posts = data?.pages.flatMap((page) => page) ?? [];
  if (error) {
    return (
      <div className="col-span-2 flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load posts</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-500 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
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
    <ul className="col-span-2">
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
        <li className="flex justify-center my-10">
          <Loader2Icon className="animate-spin size-10 text-green-300" />
        </li>
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
