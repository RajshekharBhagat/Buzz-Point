"use client";
import { formatTimeToNow } from "@/lib/utils";
import { ExtendedPost } from "@/models/Post.model";
import { Dot, MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./PostVoteClient";
import axios from "axios";
import { Vote } from "@/models/Vote.model";
import { ApiResponse } from "../../types/ApiResponse";
import Link from "next/link";
import PostOptions from "./PostOptions";
import { useSession } from "next-auth/react";

interface PostComponentProps {
  hiveName: string;
  post: ExtendedPost;
  commentAmt: number;
}

const PostComponent = ({ post, hiveName, commentAmt }: PostComponentProps) => {
  const {data: session} = useSession();
  const [upVoteCount, setUpVoteCount] = useState<number>(0);
  const [downVoteCount, setDownVoteCount] = useState<number>(0);
  const [userVote, setUserVote] = useState<"upVote" | "downVote" | null>(null);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const { data: response } = await axios.get<ApiResponse>(
          `/api/vote?postId=${post._id}`
        );
        if (response.success) {
          const votes = response.data as Vote[];
          const upVotes = votes.filter((vote) => vote.type === "upVote").length;
          const downVotes = votes.filter(
            (vote) => vote.type === "downVote"
          ).length;
          if(session) {
            const userVote = votes.find((vote) => vote.user === session?.user.id)?.type;
            setUserVote(userVote ?? null);
          }
          setUpVoteCount(upVotes);
          setDownVoteCount(downVotes);
        }
      } catch (error) {
        console.error("Error fetching votes: ", error);
      }
    };
    fetchVotes();
  }, [session?.user.id,post._id,session]);
  return (
    <div className="bg-white px-4 py-5 flex flex-col space-y-5 rounded-lg shadow-md mt-5">
      <div className="flex items-center justify-between gap-0.5 text-xs md:text-sm text-gray-500">
        <div className="flex items-center max-w-[80%]">
          {hiveName ? (
            <Link
              href={`/h/${hiveName}`}
              className="underline underline-offset-2 font-semibold text-gray-900 hover:text-gray-700"
            >
              h/{hiveName}
            </Link>
          ) : null}
          <Dot />
          <span className="truncate">Posted by u/{post.author.username}</span>
          <Dot />
          <span className="shrink-0">{formatTimeToNow(post.createdAt)}</span>
        </div>
        <PostOptions postId={post._id.toString()} author={post.author._id.toString()} />
      </div>
      <h1 className="text-gray-900 text-sm font-semibold leading-tight">
        <a href={`h/${hiveName}/post/${post._id}`}>{post.title}</a>
      </h1>
      <EditorOutput content={post.content} />
      <div className="flex items-center justify-between">
        <a
          className=" flex items-center gap-2"
          href={`/h/${hiveName}/post/${post._id}`}
        >
          <MessageSquare className="" />
          {commentAmt} Comments
        </a>
        <PostVoteClient
          downVoteCount={downVoteCount}
          upVoteCount={upVoteCount}
          userVote={userVote}
          postId={post._id.toString()}
          session={session}
        />
      </div>
    </div>
  );
};

export default PostComponent;
