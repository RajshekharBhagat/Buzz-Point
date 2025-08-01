"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ArchiveIcon,
  EllipsisVerticalIcon,
  SaveIcon,
  TrashIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { ExtendedPost } from "@/models/Post.model";

interface PostOptionsProps {
  postId: string;
  author: string;
  hiveName?: string;
}

const PostOptions = ({ postId, author, hiveName }: PostOptionsProps) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { loginToast } = useCustomToast();
  const queryClient = useQueryClient();

  const { data: isSaved } = useQuery({
    queryKey: ["isPostSaved", postId],
    queryFn: async () => {
      const response = await axios.get(`/api/post/isSaved?postId=${postId}`);
      return response.data.isSaved;
    },
    enabled: !!session?.user.id,
  });

  const { mutate: deletePost, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`/api/post/delete?postId=${postId}`);
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ 
        queryKey: ["infinite-posts", hiveName],
        exact: false 
      });
      const previousPosts = queryClient.getQueryData(["infinite-posts", hiveName]);
      queryClient.setQueryData(["infinite-posts", hiveName], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: ExtendedPost[]) => 
            page.filter((post: ExtendedPost) => post._id.toString() !== postId)
          )
        };
      });

      return { previousPosts };
    },
    onSuccess: (data) => {
      toast({
        title: "Success", 
        description: data.message,
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["infinite-posts", hiveName], context.previousPosts);
      }
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid Request",
            description: "Post ID is missing.",
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
        if (error.response?.status === 404) {
          return toast({
            title: "Failed",
            description: error.response.data.message,
          });
        }
        if (error.response?.status === 403) {
          return toast({
            title: "Failed",
            description: error.response.data.message,
          });
        }
      }
      toast({
        title: "Something went wrong.",
        description: "Failed to delete the post.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["infinite-posts", hiveName],
        exact: false 
      });
    },
  });

  const { mutate: savePost, isPending: isSavePending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/post/save?postId=${postId}`);
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["isPostSaved", postId] });
      const previousQueryState = queryClient.getQueryData([
        "isPostSaved",
        postId,
      ]);
      queryClient.setQueryData(["isPostSaved", postId], true);
      return {
        previousQueryState,
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Done",
        description: data.message,
      });
      queryClient.setQueryData(["infinite-posts", hiveName], (old: any) => {
        if (!old) return old;
      
        return {
          ...old,
          pages: old.pages.map((page: ExtendedPost[]) =>
            page.map((post: ExtendedPost) =>
              post._id.toString() === postId ? { ...post, isSaved: true } : post
            )
          ),
        };
      });
    },
    onError: (error, variable, context) => {
      if (context?.previousQueryState !== undefined) {
        queryClient.setQueryData(
          ["isPostSaved", postId],
          context.previousQueryState
        );
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid Request",
            description: "Post ID is missing",
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
        if (error.response?.status === 404) {
          return toast({
            title: "Failed",
            description: error.response.data.message,
          });
        }
      }
      toast({
        title: "Something went wrong",
        description: "Failed to save the post",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["isPostSaved", postId] });
    },
  });

  const { mutate: unSavePost, isPending: isUnSavePending } = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`/api/post/unSave?postId=${postId}`);
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["isPostSaved", postId] });
      const previousQueryState = queryClient.getQueryData([
        "isPostSaved",
        postId,
      ]);
      queryClient.setQueryData(["isPostSaved", postId], false);
      return { previousQueryState };
    },
    onSuccess: (data) => {
      toast({
        title: "Done",
        description: data.message,
      });
      queryClient.setQueryData(["isPostSaved", postId], false);
      queryClient.setQueryData(["infinite-posts", hiveName], (old: any) => {
        if (!old) return old;
      
        return {
          ...old,
          pages: old.pages.map((page: ExtendedPost[]) =>
            page.map((post: ExtendedPost) =>
              post._id.toString() === postId ? { ...post, isSaved: false } : post
            )
          ),
        };
      });
    },
    onError: (error,variable,context) => {
      if (context?.previousQueryState !== undefined) {
        queryClient.setQueryData(["isPostSaved", postId], context.previousQueryState);
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid Request",
            description: "Post ID is missing",
          });
        }
        if (error.response?.status === 404) {
          return toast({
            title: "Failed",
            description: error.response.data.message,
          });
        }
      }
      toast({
        title: "Something went wrong.",
        description: "Failed to unsave the post.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["isPostSaved", postId] });
    },
  });

  const handlePostSave = () => {
    if (isSaved) {
      unSavePost();
    } else {
      savePost();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVerticalIcon className="size-5 text-gray-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white w-[10rem]">
        <DropdownMenuItem
          onClick={handlePostSave}
          disabled={isSavePending || isUnSavePending}
          className="flex items-center gap-3"
        >
          <SaveIcon />
          <h1 className="text-xs">{isSaved ? "UnSave" : "Save"}</h1>
        </DropdownMenuItem>
        {session?.user.id === author && (
          <DropdownMenuItem className="flex items-center gap-3">
            <ArchiveIcon />
            <h1 className="text-xs">Archive</h1>
          </DropdownMenuItem>
        )}
        {session?.user.id === author && (
          <DropdownMenuItem
            onClick={() => deletePost()}
            disabled={isDeletePending}
            className="flex items-center gap-3 text-red-500"
          >
            <TrashIcon />
            <h1 className="text-xs">Delete</h1>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostOptions;
