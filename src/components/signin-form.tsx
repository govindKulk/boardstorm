"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignInForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl shadow-input py-4 bg-white dark:bg-black">
      <h2 className="font-bold text-xl sm:text-2xl text-neutral-800 dark:text-neutral-200">
        Welcome to BoardStorm
      </h2>


      <form className="my-8" onSubmit={async (e) => {
  e.preventDefault();

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  console.log("Sign in result:", result);

  try {
    if (!result?.error) {
      toast.success("Successfully logged in!");
      router.push("/boards");
    } else {
      // Try to parse structured error
      const parsedError = JSON.parse(result.error);

      switch (parsedError.code) {
        case "MISSING_CREDENTIALS":
          toast.error("Please enter both email and password.");
          break;
        case "USER_NOT_FOUND":
          toast.error("User not found. Please check your email.");
          break;
        case "INVALID_PASSWORD":
          toast.error("Incorrect password. Try again.");
          break;
        default:
          toast.error(parsedError.message || "Login failed. Try again.");
      }
    }
  } catch (err) {
    console.error("Error parsing auth error:", err);
    toast.error("Login failed. Please try again.");
  }
}}
 >
        
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" onChange={e => setEmail(e.target.value)}/>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" onChange={e => setPassword(e.target.value)} />
        </LabelInputContainer>
  

        <button
          className="bg-gradient-to-br relative group/btn from-primary  dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
            Log in &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      </form>
        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]
            
            "
            onClick={() => signIn("github")}
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm text-center">
              GitHub
            </span>
            <BottomGradient />
          </button>
    

        </div>
      <p className="text-center">
        Don't have an account register <Link href="/signup" className="text-blue-500 font-semibold">here</Link> 
      </p>
    </div>
  );
}

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
