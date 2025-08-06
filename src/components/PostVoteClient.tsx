"use client";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { cn } from "@/lib/utils";
import { PostVoteRequestType } from "@/lib/validators/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Session } from "next-auth";

type VoteType = "upVote" | "downVote" | null;

interface PostVoteClientProps {
  postId: string;
  upVoteCount: number;
  downVoteCount: number;
  userVote: VoteType;
  session?: Session | null;
  onVoteUpdate?: (voteState: {
    upVoteCount: number;
    downVoteCount: number;
    userVote: VoteType;
  }) => void;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  userVote,
  downVoteCount,
  upVoteCount,
  session,
  onVoteUpdate,
}) => {
  const { loginToast } = useCustomToast();
  const [upVote, setUpVote] = useState(upVoteCount);
  const [downVote, setDownVote] = useState(downVoteCount);
  const [userVoteType, setUserVoteType] = useState(userVote);
  const queryClient = useQueryClient();

  useEffect(() => {
    setUpVote(upVoteCount);
    setDownVote(downVoteCount);
    setUserVoteType(userVote);
  }, [userVote, downVoteCount, upVoteCount]);

  const { mutate: vote, isPending } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      if (!voteType) return;

      const payload: PostVoteRequestType = {
        postId,
        voteType,
      };

      const { data } = await axios.patch("/api/vote", payload);
      return { voteType, data };
    },
    onMutate: async (voteType: VoteType) => {
      const previousState = {
        upVote,
        downVote,
        userVoteType,
      };
      if (userVoteType === voteType) {
        if (voteType === "upVote") {
          setUpVote((prev) => prev - 1);
        } else if (voteType === "downVote") {
          setDownVote((prev) => prev - 1);
        }
        setUserVoteType(null);
      } else {
        if (voteType === "upVote") {
          setUpVote((prev) => prev + 1);
          if (userVoteType === "downVote") {
            setDownVote((prev) => prev - 1);
          }
        } else if (voteType === "downVote") {
          setDownVote((prev) => prev + 1);
          if (userVoteType === "upVote") {
            setUpVote((prev) => prev - 1);
          }
        }
        setUserVoteType(voteType);
      }
      return { previousState };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-votes", postId],
      });
    },
    onError: (error, voteType, context) => {
      if (context?.previousState) {
        setUpVote(context.previousState.upVote);
        setDownVote(context.previousState.downVote);
        setUserVoteType(context.previousState.userVoteType);
      }
      console.error("Vote error:", error);
    },
  });

  const handleVote = (voteType: VoteType) => {
    if (!session) {
      loginToast();
      return;
    }
    vote(voteType);
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={() => handleVote("upVote")}
        variant={"ghost"}
        className={cn(
          "text-sm flex items-center",
          userVoteType === "upVote" ? "text-green-500" : null
        )}
      >
        <ThumbsUpIcon className="size-5" />
        {upVote}
      </Button>
      <Button
        onClick={() => handleVote("downVote")}
        variant={"ghost"}
        className={cn(
          "text-sm flex items-center",
          userVoteType === "downVote" ? "text-green-500" : null
        )}
      >
        <ThumbsDownIcon className="size-5" />
        {downVote}
      </Button>
    </div>
  );
};

export default PostVoteClient;
