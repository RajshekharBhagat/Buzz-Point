"use client";
import { formatTimeToNow } from "@/lib/utils";
import { ExtendedPost } from "@/models/Post.model";
import { Dot, MessageSquare } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./PostVoteClient";
import axios from "axios";
import { Vote } from "@/models/Vote.model";
import { ApiResponse } from "../../types/ApiResponse";
import Link from "next/link";
import PostOptions from "./PostOptions";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface PostComponentProps {
  hiveName: string;
  post: ExtendedPost;
  commentAmt: number;
}

interface VoteData {
  upVoteCount: number;
  downVoteCount: number;
  userVote: "upVote" | "downVote" | null;
}

const PostComponent = ({ post, hiveName, commentAmt }: PostComponentProps) => {
  const {toast} = useToast();
  const { data: session } = useSession();
  const postId = post._id.toString();
  const [voteState, setVoteState] = useState<VoteData>({
    upVoteCount: 0,
    downVoteCount: 0,
    userVote: null,
  });

  const {
    data: votesData,
    isLoading: votesLoading,
    error: votesError,
  } = useQuery({
    queryKey: ["post-votes", post._id.toString()],
    queryFn: async () => {
      try {
        const { data: response } = await axios.get<ApiResponse>(
          `/api/vote?postId=${postId}`
        );
        if(!response.success) {
          console.log(response.message)
          toast({
            title: "Voting Client is Offline. Please try after sometime.",
            variant: 'destructive',
          })
          return []
        }
        return response.data as Vote[];
      } catch (error) {
        console.error("Error fetching votes:", error);
        return [];
      }
    },
    enabled: !!postId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (votesData) {
      console.log(votesData)
      const upVotes = votesData.filter((vote) => vote.type === "upVote").length;
      const downVotes = votesData.filter(
        (vote) => vote.type === "downVote"
      ).length;

      let userVote: "upVote" | "downVote" | null = null;
      if (session?.user.id) {
        const userVoteData = votesData.find(
          (vote) => vote.user === session.user.id
        );
        userVote = userVoteData?.type ?? null;
      }

      setVoteState({
        upVoteCount: upVotes,
        downVoteCount: downVotes,
        userVote,
      });
    }
  }, [votesData, session?.user.id]);

  const updateVoteState = useCallback((newVoteState: Partial<VoteData>) => {
    setVoteState((prev) => ({ ...prev, ...newVoteState }));
  }, []);

  const displayHiveName = hiveName || post.hive?.name || "unknown";

  const authorUsername = post.author?.username || "unknown";
  const authorId = post.author?._id?.toString() || "";

  return (
    <div className="bg-white px-4 py-5 flex flex-col space-y-5 rounded-lg shadow-md mt-5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between gap-0.5 text-xs md:text-sm text-gray-500">
        <div className="flex items-center max-w-[80%] min-w-0">
          {displayHiveName && displayHiveName !== "unknown" ? (
            <Link
              href={`/h/${displayHiveName}`}
              className="underline underline-offset-2 font-semibold text-gray-900 hover:text-gray-700 shrink-0"
            >
              h/{displayHiveName}
            </Link>
          ) : (
            <span className="font-semibold text-gray-900 shrink-0">
              h/unknown
            </span>
          )}
          <Dot className="shrink-0" />
          <span className="truncate">Posted by u/{authorUsername}</span>
          <Dot className="shrink-0" />
          <span className="shrink-0">{formatTimeToNow(post.createdAt)}</span>
        </div>
        <PostOptions
          postId={postId}
          author={authorId}
          hiveName={displayHiveName}
        />
      </div>
      <h1 className="text-gray-900 text-sm font-semibold leading-tight">
        <Link
          href={`/h/${displayHiveName}/post/${postId}`}
          className="hover:text-gray-700 transition-colors duration-150"
        >
          {post.title}
        </Link>
      </h1>
      <EditorOutput content={post.content} />
      <div className="flex items-center justify-between">
        <Link
          href={`/h/${displayHiveName}/post/${postId}`}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">
            {commentAmt} {commentAmt === 1 ? "Comment" : "Comments"}
          </span>
        </Link>

        {votesLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : (
          <PostVoteClient
            downVoteCount={voteState.downVoteCount}
            upVoteCount={voteState.upVoteCount}
            userVote={voteState.userVote}
            postId={postId}
            session={session}
            onVoteUpdate={updateVoteState}
          />
        )}
      </div>
    </div>
  );
};

export default PostComponent;
