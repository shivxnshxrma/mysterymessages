"use client";

import DarkVeil from "@/components/DarkVeil";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const VerifyAccount = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast(response.data.message);
      router.replace("/sign-in");
      setIsSubmitting(false);
    } catch (error) {
      console.error("verification failed", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message ??
          "An error occurred. Please try again."
      );
      setIsSubmitting(false);
    }
  };
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <DarkVeil />
      </div>
      <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-gray-900/60 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Verify Your Account
          </h1>
          <p className="mb-4 text-gray-400">
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Verification Code
                  </FormLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    className="bg-gray-800/50 border-gray-600 text-gray-200 focus-visible:ring-offset-gray-900"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className=" bg-gray-100 text-black hover:bg-gray-200 focus-visible:ring-offset-gray-900 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
