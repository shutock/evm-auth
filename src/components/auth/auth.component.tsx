"use client";

import { useAuth, useMount } from "@/hooks";

import { GetNonce } from "./get-nonce";
import { GetTokens } from "./get-tokens";

type Props = {
  children: React.ReactNode;
};

export const Auth: React.FC<Props> = ({ children }) => {
  const {
    auth: { nonce, access },
  } = useAuth();

  const { isMounted } = useMount();

  if (!isMounted) return <div>Loading...</div>;

  if (access) return children;

  return (
    <>
      <h1>Auth</h1>
      {!nonce && <GetNonce />}
      {nonce && <GetTokens />}
    </>
  );
};
