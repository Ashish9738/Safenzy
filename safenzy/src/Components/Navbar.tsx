import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

import { useUser } from "@clerk/clerk-react";

export const Navbar: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <>
      <div className="flex justify-between items-center pt-4 relative z-20 mb-5">
        {/* left section  */}
        <Link to="/">
          <h1 className="text-2xl font-bold cursor-pointer"> Safenzy</h1>
        </Link>

        {/* Right section  */}
        <div className="flex items-center space-x-3 md:space-x-6 lg:space-x-7">
          <div>
            {!isSignedIn && (
              <Button className="ghost">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
              </Button>
            )}
            {isLoaded ? (
              <SignedIn>
                <UserButton />
              </SignedIn>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
