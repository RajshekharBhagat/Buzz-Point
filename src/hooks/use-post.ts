import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useIsPostSaved = (postId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["isPostSaved", postId],
    queryFn: async () => {
      const res = await axios.get(`/api/post/isSaved?postId=${postId}`);
      return res.data.isSaved as boolean;
    },
    enabled: enabled && !!postId,
    staleTime: 1000 * 60 * 5,
  });
};