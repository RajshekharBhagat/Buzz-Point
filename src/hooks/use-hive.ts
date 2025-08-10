import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "../../types/ApiResponse";
import { useToast } from "./use-toast";
import { useCustomToast } from "./use-custom-toast";

type TopHives = {
  _id: string;
  subscriberCount: number;
  name: string;
  description: string;
};

export const useGetTopHives = () => {
  return useQuery({
    queryKey: ["top-hives"],
    queryFn: async () => {
      const { data: response } = await axios.get("/api/hive/get-top-hives");
      return response.data as TopHives[];
    },
  });
};


interface HiveDetails {
    _id: string;
  name: string;
  creator: string;
  createdAt: Date;
  subscribersCount: number;
  isSubscribed: boolean;
  isCreator: boolean;
}
export const useGetHiveByName = (hiveName: string) => {
  return useQuery({
    queryKey: ["hive", hiveName],
    queryFn: async ({ queryKey }) => {
      const [, hiveName] = queryKey;
      const { data: response } = await axios.get<ApiResponse<HiveDetails>>(
        `/api/hive?hiveName=${hiveName}`
      );
      if (!response.success) {
        throw new Error('Hive not found')
      }
      return response.data;
    },
  });
};

export const useSubscribeToHive = (hiveId: string, hiveName: string) => {
  const {toast} = useToast();
  const {loginToast} = useCustomToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/hive/subscribe",{hiveId});
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey: ['hive',hiveName]});
      const previousHiveDetails = queryClient.getQueryData(['hive',hiveName]);
      queryClient.setQueryData(['hive',hiveName],(old: any) => {
        if(!old) return old;
        return {
          ...old,
          subscribersCount: old.subscribersCount + 1,
          isSubscribed: true,
        }
      });
      return {previousHiveDetails};
    },
    onSuccess: (data) => {
      toast({
        title: `Subscribed`,
        description: `You are now subscribed to h/${hiveName}`,
      });
      queryClient.invalidateQueries({queryKey:['hive',hiveName]})
    },
    onError: (error,_,context) => {
      if(context?.previousHiveDetails) {
        queryClient.setQueryData(['hive',hiveName],context.previousHiveDetails);
      }
      console.log(`Error Subscribing to the hive: ${error}`);
      if(error instanceof AxiosError) {
        if(error.response?.status === 401) {
          return loginToast();
        }
        return toast({
          title: error.response?.data.message,
        })
      }
      toast({
        title: "Something Went Wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['hive',hiveName]});
    }
  })
}

export const useUnSubscribeToHive = (hiveId: string, hiveName: string) => {
  const {toast} = useToast();
  const{loginToast} = useCustomToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/hive/unsubscribe", {hiveId});
      return data;
    },
    onMutate: () => {
      queryClient.cancelQueries({queryKey:['hive',hiveName]});
      const previousHive = queryClient.getQueryData(['hive',hiveName]);
      queryClient.setQueryData(['hive',hiveName],(old:any) => {
        if(!old) return old;
        return {
          ...old,
          subscribersCount: old.subscribersCount - 1,
          isSubscribed: false,
        }
      });
      return {previousHive};
    },
    onSuccess: () => {
      toast({
        title: "Unsubscribed.",
        description: `You are now unsubscribed to ${hiveName}`,
      });
    },
    onError: (error,_,context) => {
      if(context?.previousHive) {
        queryClient.setQueryData(['hive',hiveName], context.previousHive);
      }
      console.log("Error during unsubscribing", error);
      if(error instanceof AxiosError) {
        if(error.response?.status === 401) {
          return loginToast();
        }
        return toast({
          title: error.response?.data.message,
          variant: "destructive",
        })
      }
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['hive',hiveName]})
    }
  })
}
