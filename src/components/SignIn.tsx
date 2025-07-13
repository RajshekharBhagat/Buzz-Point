import Image from "next/image";
import React from "react";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

export default function SignIn() {
  return (
    <div className="relative z-[999] max-w-md border border-green-300 rounded-lg p-2 bg-white overflow-clip w-full mx-auto">
      <div className="flex flex-col gap-3 text-center p-2">
        <div className=" relative aspect-video w-[50%] mx-auto">
          <Image src={"/assets/BuzzPoint_Logo.png"} alt="Logo" fill className="object-contain bg-center" />
        </div>
        <h1 className="font-semibold tracking-tight text-lg">Welcome Back</h1>
        <p className="text-xs max-w-md mx-auto">
          By continuing, you are setting up you BussPoint account, and agree to
          our User Agreement and Privacy Policy
        </p>
        <UserAuthForm />
        <div className="flex text-xs justify-center gap-5">
          <p>New to BuzzPoint ?</p>
          <Link href={"/sign-up"} className="font-semibold hover:underline text-green-700">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
