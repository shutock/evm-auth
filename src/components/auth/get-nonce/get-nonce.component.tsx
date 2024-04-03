"use client";

import React from "react";
import { useAccount, useConnect } from "wagmi";

import { useAuth } from "@/hooks";

export const GetNonce: React.FC = () => {
  const { getNonce } = useAuth();
  const { isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();

  React.useEffect(() => {
    isConnected && getNonce();
  }, [getNonce, isConnected]);

  return (
    <div>
      <h2>{!isConnected ? "Connect" : "Getting nonce"}</h2>

      <div>
        {connectors.map((connector, id) => {
          const { id: key, name } = connector;

          const onClick = () => connectAsync({ connector });

          return (
            <button key={`${key}${id}`} {...{ onClick }}>
              {name}
            </button>
          );
        }, [])}
      </div>
    </div>
  );
};
