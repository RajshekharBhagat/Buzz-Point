'use client';
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import TopHives from "./TopHives";

const MainSideBar = () => {
  return (
    <div className="lg:sticky lg:top-20 my-5 h-fit flex flex-col gap-10">
      <div className=" border border-emerald-200 rounded-lg shadow-lg shadow-black/10">
        <div className="bg-emerald-100 px-6 py-4">
          <p className="flex items-center py-3 font-semibold gap-1.5">
            <HomeIcon className="w-4 h-4" />
            Home
          </p>
        </div>
        <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <p className="text-zinc-900">
              Your personal BuzzPoint homepage. Come here to check in with your
              favorite communities.
            </p>
          </div>
          <Link
            href={"h/create"}
            className={buttonVariants({ className: "w-full mt-4 mb-6" })}
          >
            Create a new Hive
          </Link>
        </div>
      </div>
    <TopHives />
    </div>
  );
};

export default MainSideBar;
