import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import UserAccountNav from "./UserAccountNav";
import { getAuthSession } from "@/lib/auth";

const NavBar = async() => {
  const session = await getAuthSession();
  return (
    <nav className="fixed w-[100dvw] top-0 h-fit bg-green-200/50  backdrop-blur-xl md:backdrop-blur border-b border-green-400 z-50">
      <MaxWidthWrapper className="flex items-center justify-between gap-2 py-2 px-4">
        <div className="relative aspect-[461/80] w-36">
          <Link href="/">
            <Image src={"/assets/BuzzPoint_Logo.png"} alt="Logo" fill className="object-contain" />
          </Link>
        </div>
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ): (
          <Link href="/sign-in" className={buttonVariants()}>
          Sign in
        </Link>
        )}
      </MaxWidthWrapper>
    </nav>
  );
};

export default NavBar;
