"use client";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import Header from "./Header";
import { otpFormSchema } from "@/types/auth.type";
import { type z } from "zod";

export default function InputOTPForm({ email, user }: { email: string, user : {
  id: number;
  name: string;
  email: string;
} }) {

  const router = useRouter();

  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const verify = api.auth.verifyEmail.useMutation({
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  function onSubmit(data: z.infer<typeof otpFormSchema>) {
    verify.mutate({
      otp: data.otp,
    });
    form.reset();
  }

  return (
    <div className="absolute left-0 top-0 flex min-h-screen w-screen flex-col items-center justify-start gap-8 bg-background">
      <Header user={user} />
      <Card className="my-8 h-full w-11/12 pb-8 md:w-3/5 lg:w-2/5 2xl:w-1/3">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            <div>
              <h3>Verify your email</h3>
              <p className="mt-4 flex flex-col items-center justify-start text-[.5em] font-normal">
                <span>Enter the 8 digit code you have received on</span>
                <span>{email}</span>
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex w-full flex-col items-center justify-start gap-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={8} {...field}>
                        <InputOTPGroup className="flex w-full flex-row items-center justify-center gap-2">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                          <InputOTPSlot index={6} />
                          <InputOTPSlot index={7} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                verify
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
