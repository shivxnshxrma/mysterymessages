"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    // Make the navbar fixed, full-width, and ensure it's on top with z-index
    <nav className="fixed top-0 left-0 right-0 z-50 py-3">
      {/* This inner container now holds the styling and max-width */}
      <div className="container mx-auto max-w-screen-xl px-10 py-3 rounded-full bg-black/30 backdrop-blur-lg border border-white/10 shadow-xl">
        <div className="flex justify-between items-center">
          {/* Logo or Brand Name */}
          <div>
            <a
              href="/"
              className="text-xl font-bold text-white flex items-center gap-2"
            >
              <img
                src="easter-bunny.png"
                className="w-10 h-10 filter invert brightness-0 contrast-200"
                alt="Logo"
              />
              MysteryMessage
            </a>
          </div>
          <div>
            {session && (
              <>
                <span className="mr-30 text-lg font-bold text-gray-200">
                  Welcome, {user?.username || user?.email}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Button
                  onClick={() => signOut()}
                  className="text-white hover:bg-white cursor-pointer rounded-4xl text-lg font-semibold"
                  variant="ghost"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button
                  className="text-white hover:bg-white cursor-pointer rounded-4xl text-lg font-semibold"
                  variant="ghost"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
