"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import type * as z from "zod";

import { signupFormSchema } from "@/types/auth.type";

import EmailVerification from "@/components/EmailVerification";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormItem, FormControl, FormField, FormMessage } from "@ui/form";

import { Input } from "@ui/input";
import { Label } from "@ui/label";

import Header from "@/components/Header";

import { api } from "@/trpc/react";

type formSchemaType = z.infer<typeof signupFormSchema>;

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
  });

  const router = useRouter();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(signupFormSchema),
  });

  const signup = api.auth.signup.useMutation({
    onSuccess: (data) => {
      form.reset();
      setEmail(data.user.email);

      if (data?.token) {
        console.log("token : " + data.token);
      }
    },
    onError: (error) => {
      alert(error.message);
      router.refresh();
      console.log("Error :", error.message);
    },
  });

  const onSubmit: SubmitHandler<formSchemaType> = async (
    data: formSchemaType,
  ) => {
    signup.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  const getUser = api.auth.isLogedIn.useMutation({
    onSuccess: (data) => {
      console.log(data);
      router.push("/dashboard");
      setUser(data.user);
    },
  });

  useEffect(() => {
    if (!email.length) {
      getUser.mutate({});
    }
  }, []);

  return (
    <div className="absolute left-0 top-0 flex min-h-screen w-screen flex-col items-center justify-start gap-8 bg-background">
      <Header
        user={{
          id: 0,
          name: "",
          email: "",
        }}
      />
      {email.length ? (
        <EmailVerification email={email} user={user} />
      ) : (
        <Card className="my-8 h-full w-11/12 pb-8 md:w-3/5 lg:w-2/5 2xl:w-1/3">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-semibold">
              Create your account
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">Name</Label>
                      <div className="flex items-center gap-2 rounded-md bg-secondary p-1">
                        <FormControl>
                          <Input
                            name="name"
                            id="name"
                            className="border-none outline-none focus-visible:ring-0"
                            type="text"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Enter"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2 rounded-md bg-secondary p-1">
                        <FormControl>
                          <Input
                            name="email"
                            id="email"
                            className="border-none outline-none focus-visible:ring-0"
                            type="email"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="abc@example.com"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password">Password</Label>
                      <div className="flex items-center gap-2 rounded-md bg-secondary p-1">
                        <FormControl>
                          <Input
                            name="password"
                            id="password"
                            className="border-none outline-none focus-visible:ring-0"
                            type="password"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="password"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full justify-center pt-4">
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    Create account
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-center gap-2 pb-16">
            <p>Have an account?</p>
            <a
              href="/login"
              className="font-semibold text-blue-600 underline hover:text-blue-800"
            >
              Login
            </a>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SignupPage;
