import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "../../types/ApiResponse";
import { useToast } from "./use-toast";
import { Vote } from "@/models/Vote.model";

export const useGetVotesByPostId = (postId: string) => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ["post-votes", postId],
    queryFn: async ({ queryKey }) => {
      const [, postId] = queryKey;
      const { data: response } = await axios.get<ApiResponse<Vote[]>>(
        `/api/vote?postId=${postId}`
      );
      if (!response.success) {
        toast({
          title: "Failed to fetch votes",
          description: "Vote service is offline. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
      return response.data;
    },

    enabled: !!postId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};
