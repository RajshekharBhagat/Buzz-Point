"use client";
import { FC, startTransition } from "react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { HiveSubscriptionPayload } from "@/lib/validators/hive";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "../../types/ApiResponse";
import { useRouter } from "next/navigation";

interface SubscribeUnsubscribeToggleProps {
  hiveId: string;
  isSubscribed: boolean;
  hiveName: string;
}

const SubscribeUnsubscribeToggle: FC<SubscribeUnsubscribeToggleProps> = ({
  hiveId,
  hiveName,
  isSubscribed,
}) => {
  const { loginToast } = useCustomToast();
  const { toast } = useToast();
  const router = useRouter();
  const { mutate: subscribe, isPending: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: HiveSubscriptionPayload = {
        hiveId,
      };
      const { data } = await axios.post("/api/hive/subscribe", payload);
      return data;
    },
    onSuccess: (data) => {
      startTransition(() => {
        router.refresh();
      });
      toast({
        title: `Subscribed`,
        description: `You are now subscribed to h/${hiveName}`,
      });
    },
    onError: (error) => {
      console.log(`Error Subscribing to the hive: ${error}`);
      if(error instanceof AxiosError) {
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
  });

  const { mutate: unsubscribe, isPending: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: HiveSubscriptionPayload = {
        hiveId: hiveId,
      };
      const { data } = await axios.post("/api/hive/unsubscribe", payload);
      return data;
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Unsubscribed.",
        description: `You are now unsubscribed to ${hiveName}`,
      });
    },
    onError: (error) => {
      console.log("Error during unsubscribing", error);
      if(error instanceof AxiosError) {
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
  });

  return isSubscribed ? (
    <Button onClick={() => unsubscribe()} isLoading={isUnsubLoading} className="w-full mt-1 mb-4">Unsubscribe</Button>
  ) : (
    <Button
      onClick={() => subscribe()}
      isLoading={isSubLoading}
      className="w-full mt-1 mb-4"
    >
     Subscribe
    </Button>
  );
};

export default SubscribeUnsubscribeToggle;
