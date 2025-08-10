import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "../../types/ApiResponse";
import { useToast } from "./use-toast";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/models/Post.model";
import { Session } from "inspector/promises";


interface UseInfinitePostsProps {
  type?: "feed" | "hive" | "user-posts" | "saved";
  hiveName?: string;
  username?: string;
  fields?: string;
}
export const useInfinitePosts = ({
  type = "feed",
  hiveName,
  username,
  fields = "hive,author,comments",
}: UseInfinitePostsProps) => {
  const getQueryKey = () => {
    const baseKey = ["infinite-posts"];
    switch (type) {
      case "hive":
        return [...baseKey, "hive", hiveName];
      case "saved":
        return [...baseKey, "saved"];
      case "user-posts":
        return [...baseKey, "user-posts", username];
      default:
        return [...baseKey, "feed"];
    }
  };

  const buildQueryString = (pageParam: number) => {
    const params = new URLSearchParams({
      limit: INFINITE_SCROLLING_PAGINATION_RESULTS.toString(),
      page: pageParam.toString(),
      type,
      fields,
    });

    if (type === "hive" && hiveName) {
      params.append("hiveName", hiveName);
    }
    if (type === "user-posts" && username) {
      params.append("username", username);
    }

    return `/api/post?${params.toString()}`;
  };

  return useInfiniteQuery({
    queryKey: getQueryKey(),
    queryFn: async ({ pageParam = 1 }) => {
      const query = buildQueryString(pageParam);
      const { data: response } = await axios.get(query);
      return response.posts as ExtendedPost[];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < INFINITE_SCROLLING_PAGINATION_RESULTS) {
        return undefined;
      }
      return pages.length + 1;
    },
    refetchOnWindowFocus: type === "saved",
    staleTime: type === "saved" ? 0 : 5 * 60 * 1000,
  });
};


export const useIsPostSaved = (postId: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["isPostSaved", postId],
    queryFn: async () => {
      const res = await axios.get(`/api/post/isSaved?postId=${postId}`);
      return res.data.isSaved as boolean;
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeletePostById = (
  postId: string,
  hiveName?: string,
  username?: string
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const removePostFromCache = (postId: string) => {
    const keys = [
      ["infinite-posts", "feed"],
      ["infinite-posts", "saved"],
      ["infinite-posts", "user-posts", username],
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
  return useMutation({
    mutationFn: async () => {
      const { data: response } = await axios.delete<ApiResponse<undefined>>(
        `/api/post/delete?postId=${postId}`
      );
      return response;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["infinite-posts"] });
      removePostFromCache(postId);
    },
    onSuccess: () => {
      toast({
        title: "Post Deleted",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["infinite-posts"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete post",
        variant: "destructive",
      });
    },
  });
};

export const useSavePostById = (postId : string) => {
  const {toast} = useToast();
  const queryClient = useQueryClient();
  return useMutation({
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
}

export const useUnsavePostById = (postId: string) => {
  const {toast} = useToast()
  const queryClient = useQueryClient();
  return useMutation({
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
}