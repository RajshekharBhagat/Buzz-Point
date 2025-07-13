import CloseModal from "@/components/CloseModal";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SignIn from "@/components/SignIn";
import { FC } from "react";


const page: FC = () => {
  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-[2px] z-[999]">
      <MaxWidthWrapper className="relative flex flex-col items-center justify-center">
        <div className="relative shadow-2xl">
          <div className="absolute z-[9999] top-2 w-4 h-4 right-6 cursor-pointer">
            <CloseModal />
          </div>
          <SignIn />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
