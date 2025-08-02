"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bookmark, BookmarkX, MoreHorizontal, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useIsPostSaved } from "@/hooks/use-post";

interface PostOptionsProps {
  postId: string;
  author: string;
  hiveName?: string;
}

const PostOptions = ({ postId, author, hiveName }: PostOptionsProps) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const isUserPost = session?.user.id === author;

  const { data: isSaved } = useIsPostSaved(postId, pathname !== "/saved");

  const removePostFromCache = (postId: string) => {
    const keys = [
      ["infinite-posts", "feed"],
      ["infinite-posts", "saved"],
      ["infinite-posts", "user-posts", session?.user.username],
      hiveName ? ["infinite-posts", "hive", hiveName] : null,
    ].filter(Boolean) as string[][];

    keys.forEach((key) => {
      queryClient.setQueryData(key, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any[]) =>
            page.filter((post) => post._id !== postId)
          ),
        };
      });
    });
  };

  const deletePost = useMutation({
    mutationFn: async () => {
      return axios.delete(`/api/post/delete?postId=${postId}`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["infinite-posts"] });
      removePostFromCache(postId);
    },
    onSuccess: () => {
      toast({ title: "Post deleted successfully" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["infinite-posts"] });
    },
    onError: () => {
      toast({
        title: "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const savePost = useMutation({
    mutationFn: async () => {
      return axios.post(`/api/post/save?postId=${postId}`);
    },
    onSuccess: () => {
      toast({ title: "Post saved" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["isPostSaved", postId] });
    },
    onError: () => {
      toast({
        title: "Failed to save post",
        variant: "destructive",
      });
    },
  });

  const unSavePost = useMutation({
    mutationFn: async () => {
      return axios.delete(`/api/post/unSave?postId=${postId}`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["infinite-posts", "saved"] });
      queryClient.setQueryData(["infinite-posts", "saved"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any[]) =>
            page.filter((post) => post._id !== postId)
          ),
        };
      });
    },
    onSuccess: () => {
      toast({ title: "Post unsaved" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["infinite-posts", "saved"] });
      queryClient.invalidateQueries({ queryKey: ["isPostSaved", postId] });
    },
    onError: () => {
      toast({
        title: "Failed to unsave post",
        variant: "destructive",
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isSaved ? (
          <DropdownMenuItem onClick={() => unSavePost.mutate()}>
            <BookmarkX className="mr-2 h-4 w-4" />
            Unsave
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => savePost.mutate()}>
            <Bookmark className="mr-2 h-4 w-4" />
            Save
          </DropdownMenuItem>
        )}
        {isUserPost && (
          <DropdownMenuItem
            onClick={() => deletePost.mutate()}
            className="text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostOptions;
