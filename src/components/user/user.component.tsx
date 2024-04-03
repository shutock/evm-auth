"use client";

import { useAuth } from "@/hooks";
import { useDisconnect } from "wagmi";

export const User: React.FC = () => {
  const { address, auth, reset } = useAuth();
  const { disconnectAsync } = useDisconnect();

  const logout = async () => {
    await disconnectAsync();
    reset();
  };

  return (
    <>
      <pre>{JSON.stringify({ address, auth }, null, 2)}</pre>
      <button onClick={logout}>Logout</button>
    </>
  );
};
