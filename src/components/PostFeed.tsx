"use client";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/models/Post.model";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";
import PostComponent from "./PostComponent";

interface PostFeedProps {
  initialPost: ExtendedPost[];
  hiveName?: string;
}

const PostFeed = ({ initialPost, hiveName }: PostFeedProps) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["infinite-query", hiveName],
      queryFn: async ({ pageParam = 1 }) => {
        const query =
          `/api/post?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
          (hiveName ? `&hiveName=${hiveName}` : "");
        const { data: response } = await axios.get(query);
        return response.data.posts as ExtendedPost[];
      },
      initialData: {
        pages: [initialPost],
        pageParams: [1],
      },
      initialPageParam: 1,
      getNextPageParam: (_, pages) => pages.length + 1,
    });

    useEffect(() => {
      if(entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },[entry,fetchNextPage,hasNextPage,isFetchingNextPage])

  const posts = data?.pages.flatMap((page) => page) ?? initialPost;
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
    </ul>
  );
};

export default PostFeed;
