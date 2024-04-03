"use client";

import React from "react";

import { Auth, User } from "@/components";
import { useAuth } from "@/hooks";

const HomePage: React.FC = () => {
  const { isLoading } = useAuth();

  return (
    <>
      {isLoading && <div>Loading...</div>}
      <Auth>
        <h1>Authenticated</h1>
        <User />
      </Auth>
    </>
  );
};

export default HomePage;
