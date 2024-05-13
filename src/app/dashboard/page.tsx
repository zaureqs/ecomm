"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { api } from "@/trpc/react";

function Dashboardpage() {
  const router = useRouter();

  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
  });

  const getUser = api.auth.isLogedIn.useMutation({
    onSuccess: (data) => {
      console.log(data);
      setUser(data.user);
    },
    onError: () => {
      router.push("/login");
    },
  });

  useEffect(() => {
    getUser.mutate({});
  }, []);

  return (
    <div className="absolute left-0 top-0 flex min-h-screen w-screen flex-col items-center justify-start gap-8 bg-background">
      <Header user={user} />
      <Card className="my-8 h-full w-11/12 pb-8 md:w-3/5 lg:w-2/5 2xl:w-1/3">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-start text-center text-3xl font-semibold">
            <span className="mb-4 text-[1em]">Please mark your interests!</span>
            <span className="text-[0.5em] font-normal">
              We will keep you notified.
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div>My saved interests!</div>
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <Input
                name="Checkbox"
                id="Checkbox"
                className="h-4 w-4"
                type="checkbox"
                onChange={() => console.log("Check")}
              />
              <Label
                htmlFor="Checkbox"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Shoes
              </Label>
            </div>
            <div className="flex flex-row items-center justify-start gap-2">
              <Input
                name="Checkbox"
                id="Checkbox"
                className="h-5 w-5"
                type="checkbox"
                onChange={() => console.log("Check")}
              />
              <Label
                htmlFor="Checkbox"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Men T-shirts
              </Label>
            </div>
            <div className="flex flex-row items-center justify-start gap-2">
              <Input
                name="Checkbox"
                id="Checkbox"
                className="h-5 w-5"
                type="checkbox"
                onChange={() => console.log("Check")}
              />
              <Label
                htmlFor="Checkbox"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Makeup
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2">
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Dashboardpage;
