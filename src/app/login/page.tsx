"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import type * as z from "zod";

import { loginFormSchema } from "@/types/auth.type";

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

import { api } from "@/trpc/react";

type formSchemaType = z.infer<typeof loginFormSchema>;


const LoginPage: React.FC = () => {

  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(loginFormSchema),
  });

  const login = api.auth.login.useMutation({
    onSuccess: (data) => {
      router.push("/");
      console.log("data", data);
    },
    onError: (error) => {
      alert(error.message);
      console.log("Error :", error.message);
    },
  });

  const getUser = api.auth.isLogedIn.useMutation({
    onSuccess: (data) => {
      console.log(data);
      router.push("/dashboard");
      setUser(data.user);
    }
  });

  useEffect(() => {
    getUser.mutate({});
  }, []);

  const onSubmit: SubmitHandler<formSchemaType> = async (
    data: formSchemaType,
  ) => {
    login.mutate({
      email: data.email,
      password: data.password,
    });
    console.log(data);
    form.reset();
  };

  return (
    <div className="absolute left-0 top-0 flex min-h-screen w-screen flex-col items-center justify-start gap-8 bg-background">
      <Header user = { user }/>
      <Card className="my-8 h-full w-11/12 pb-8 md:w-3/5 lg:w-2/5 2xl:w-1/3">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold flex flex-col justify-start items-center">
              <span className="text-[1em] mb-8">Login</span>
              <span className="text-[0.8em] font-normal"> Welcome back to ECOMMERCE</span>
              <span className="text-sm font-normal"> The next gen business marketplace </span>
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
                        <div className="flex flex-row w-full items-center">
                        <Input
                          name="password"
                          id="password"
                          className="border-none outline-none focus-visible:ring-0 w-full"
                          type={(showPassword ? "text" : "password")}
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="password"
                        />
                        <button type="button" className="hover:cursor-pointer hover:underline pr-2" onClick={() => setShowPassword(!showPassword)}>show</button>
                        </div>
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
                  LOGIN
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-center gap-2 pb-16">
          <p>{"Don’t have an Account?" }</p>
          <a
            href="/signup"
            className="font-semibold text-blue-600 underline hover:text-blue-900"
          >
            signup
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
