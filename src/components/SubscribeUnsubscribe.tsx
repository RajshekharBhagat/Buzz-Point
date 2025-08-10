"use client";
import React, { FC} from "react";
import { Button } from "./ui/button";
import { useSubscribeToHive, useUnSubscribeToHive } from "@/hooks/use-hive";

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

  
  const {mutate: subscribe, isPending: isSubLoading} = useSubscribeToHive(hiveId, hiveName);
  const {mutate: unsubscribe, isPending: isUnsubLoading} = useUnSubscribeToHive(hiveId, hiveName);

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
