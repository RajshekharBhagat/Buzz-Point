import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SignIn from "@/components/SignIn";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

const page: FC = ({}) => {
  return (
    <div className="absolute inset-0">
      <MaxWidthWrapper className="flex flex-col items-center justify-center">
        <Link href={'/'} className={cn(buttonVariants({variant:'ghost'}))}>Home</Link>
        <SignIn />
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
