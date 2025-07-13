import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import UserAccountNav from "./UserAccountNav";
import { getAuthSession } from "@/lib/auth";

const NavBar = async () => {
  const session = await getAuthSession();
  return (
    <nav className="fixed inset-0 h-fit bg-green-100 border-b border-green-400 z-[10] py-2">
      <MaxWidthWrapper className="flex items-center justify-between gap-2">
        <div className="h-6 w-36 relative">
          <Link href="/">
            <Image src={"/assets/BuzzPoint_Logo.png"} alt="Logo" fill />
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
