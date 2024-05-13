'use client';
import React from "react";

import { useRouter } from "next/navigation";

import Offer from "./Offer";
import Logo from "./Logo";

function Header({user} : {user : {id: number; name: string; email: string}}) {

  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-start justify-center">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full flex-row items-center justify-end gap-4 p-2">
          <span className="hover:underline">help</span>
          <span className="hover:underline">orders & returns</span>
          {user?.id ? (
            <button className="rounded bg-slate-300 px-2 py-1 hover:underline">
            logout
          </button>
          ) : (
            <button className="rounded bg-slate-300 px-2 py-1 hover:underline" 
            onClick={() => router.push('/login')}
            >
            login
          </button>
          )}
        </div>
        <div className="flex w-full flex-row items-center justify-between p-2">
          <Logo />
          <div className="flex flex-row justify-center gap-2 items-center font-semibold">
            <span className="hover:underline hover:cursor-pointer">Categories</span>
            <span className="hover:underline hover:cursor-pointer">Sale</span>
            <span className="hover:underline hover:cursor-pointer">Clearance</span>
            <span className="hover:underline hover:cursor-pointer">New stock</span>
            <span className="hover:underline hover:cursor-pointer">Trending</span>
          </div>
          <div>
            <button>srch</button>
            <button>cart</button>
          </div>
        </div>
      </div>
      <Offer />
    </div>
  );
}

export default Header;
