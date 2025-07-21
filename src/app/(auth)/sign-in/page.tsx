"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInSchema } from "@/schemas/signInSchema";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import DarkVeil from "@/components/DarkVeil";

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        console.error(result.error);
        if (result.error === "CredentialsSignin") {
          toast("Incorrect username or password");
        } else {
          toast(result.error);
          // console.error("Sign-in error:", result.error);
        }
        return; // Prevent redirect if there's an error
      }

      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Orb is now positioned absolutely to act as the background */}
      <div className="absolute inset-0">
        <DarkVeil />
      </div>

      {/* Form is now centered on top with a higher z-index and glassmorphism styling */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-gray-900/60 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl">
        <div className="text-center">
          {/* Text colors updated for contrast on a dark background */}
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4 text-gray-300">
            Sign in to continue your secret conversations
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Email/Username
                  </FormLabel>
                  {/* Inputs are styled for a dark theme */}
                  <Input
                    {...field}
                    required
                    className="bg-gray-800/50 border-gray-600 text-gray-200 focus-visible:ring-offset-gray-900"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    required
                    className="bg-gray-800/50 border-gray-600 text-gray-200 focus-visible:ring-offset-gray-900"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button styled to be a clear call to action */}
            <Button
              className="w-full bg-gray-100 text-black hover:bg-gray-200 focus-visible:ring-offset-gray-900 cursor-pointer"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center text-gray-400">
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
