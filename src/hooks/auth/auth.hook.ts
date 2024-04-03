import { type Address } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { create } from "zustand";

import { type ApiData, type User } from "@/lib";
import { createJSONStorage, persist } from "zustand/middleware";
import { decrypt, encrypt, signInMessage } from "@/utils";
import React from "react";

type State = {
  auth: { access?: string; refresh?: string; nonce?: string };
  address?: Address;
  isLoading: boolean;
  error?: Error;
};

const initialState: State = {
  address: undefined,
  auth: { access: undefined, refresh: undefined, nonce: undefined },
  isLoading: false,
  error: undefined,
};

type Actions = {
  setAddress: (address?: Address) => void;
  setAuth: (auth: State["auth"]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error?: Error) => void;

  reset: () => void;
};

const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setAddress: (address) => set({ address }),
      setAuth: (auth) => set({ auth }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => ({
        getItem: (key) => decrypt(localStorage.getItem(key) || ""),
        setItem: (key, value) => localStorage.setItem(key, encrypt(value)),
        removeItem: (key) => localStorage.removeItem(key),
      })),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["isLoading", "error"].includes(key)
          )
        ),
    }
  )
);

export const useAuth = () => {
  const {
    auth,
    setAuth,
    isLoading,
    setIsLoading,
    address,
    setAddress,
    error,
    setError,
    reset,
  } = useStore();

  const { address: connectedAddress } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const getNonce = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      if (!connectedAddress) throw new Error("Address not found");

      const res = await fetch(`/api/auth?address=${connectedAddress}`);
      if (!res.ok) throw new Error("Failed to get nonce");

      const data = decrypt((await res.json()).data) as ApiData<{
        auth: { nonce: string };
      }>;

      if (!data.isSuccess) throw new Error("Failed to get nonce");

      const { auth } = data;

      setAuth({ nonce: auth.nonce });
      setAddress(connectedAddress);
    } catch (error) {
      setError(error as Error);
      setTimeout(() => setError(undefined), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [connectedAddress, setAddress, setAuth, setError, setIsLoading]);

  const getTokens = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const nonce = auth.nonce;

      if (!nonce) throw new Error("Nonce not found");

      if (!address) throw new Error("Address not found");
      if (connectedAddress !== address) throw new Error("Address mismatch");

      const signature = await signMessageAsync({
        message: signInMessage(nonce),
        account: address,
      });

      const res = await fetch(`/api/auth`, {
        method: "POST",
        body: JSON.stringify({ address, signature }),
      });
      if (!res.ok) throw new Error("Failed to get access and refresh");

      const data = decrypt((await res.json()).data) as ApiData<{
        auth: { access: string; refresh: string };
      }>;
      if (!data.isSuccess) throw new Error("Failed to get access and refresh");

      setAuth(data.auth);
    } catch (error) {
      setError(error as Error);
      setTimeout(() => setError(undefined), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [
    address,
    auth.nonce,
    connectedAddress,
    setAuth,
    setError,
    setIsLoading,
    signMessageAsync,
  ]);

  const refreshTokens = React.useCallback(async () => {
    try {
      setIsLoading(true);

      if (!address) throw new Error("Address not found");
      if (connectedAddress !== address) throw new Error("Address mismatch");

      const refresh = auth.refresh;
      if (!refresh) throw new Error("Refresh not found");

      const res = await fetch(`/api/auth`, {
        method: "PATCH",
        body: JSON.stringify({ address, refresh }),
      });
      if (!res.ok) throw new Error("Failed to refresh tokens");

      const data = decrypt((await res.json()).data) as ApiData<{
        auth: { access: string; refresh: string };
      }>;
      if (!data.isSuccess) throw new Error("Failed to refresh tokens");

      setAuth(data.auth);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [address, auth.refresh, connectedAddress, setAuth, setIsLoading]);

  return {
    auth,
    address,
    isLoading,
    error,
    getNonce,
    getTokens,
    refreshTokens,
    reset,
  };
};
