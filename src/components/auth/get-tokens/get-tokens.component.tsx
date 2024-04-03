"use client";

import { useAuth } from "@/hooks";
import React from "react";

export const GetTokens: React.FC = () => {
  const { getTokens } = useAuth();

  return (
    <>
      <h2>Tokens</h2>
      <button onClick={() => getTokens()}>Get tokens</button>
    </>
  );
};
