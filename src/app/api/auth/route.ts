import { NextResponse } from "next/server";
import { isAddress, http, createPublicClient } from "viem";
import { mainnet } from "viem/chains";

import { type Route } from "@/lib";
import { database, encrypt, signInMessage } from "@/utils";

const LIFETIME = {
  nonce: Number(process.env.NONCE_TOKEN_LIFETIME || 600),
  access: Number(process.env.ACCESS_TOKEN_TOKEN_LIFETIME || 3600),
  refresh: Number(process.env.REFRESH_TOKEN_TOKEN_LIFETIME || 2592000),
};

const publicClient = createPublicClient({ chain: mainnet, transport: http() });

// get nonce
export const GET: Route = async ({ nextUrl }) => {
  try {
    const address = nextUrl.searchParams.get("address");
    if (!address) throw new Error("Address is required");
    if (!isAddress(address)) throw new Error("Invalid address");

    const nonce = Math.random().toString(36).slice(2);

    const { isSuccess } = await database(nextUrl).set(address, {
      auth: { nonce: { value: nonce, date: Date.now() } },
    });

    if (!isSuccess) throw new Error("Failed to set nonce");

    return NextResponse.json({
      data: encrypt({ isSuccess: true, auth: { nonce } }),
    });
  } catch (error) {
    return NextResponse.json({
      data: encrypt({
        isSuccess: false,
        message: (error as Error).message || "Auth failed",
      }),
    });
  }
};

// get refresh and access
export const POST: Route = async (req) => {
  try {
    const { address, signature } = await req.json();
    if (!address) throw new Error("Address is required");
    if (!isAddress(address)) throw new Error("Invalid address");
    if (!signature) throw new Error("Signature is required");

    const user = await database(req.nextUrl).get(address);
    const nonce = user?.auth?.nonce;
    if (!nonce) throw new Error("Nonce not found");

    const date = Date.now();
    if (nonce.date + LIFETIME.nonce * 1000 < date)
      throw new Error("Nonce expired");

    const isVerified = await publicClient.verifyMessage({
      address,
      message: signInMessage(nonce.value),
      signature,
    });

    if (!isVerified) throw new Error("Failed to verify signature");

    const refresh = Math.random().toString(36).slice(2);
    const access = Math.random().toString(36).slice(2);

    const { isSuccess } = await database(req.nextUrl).update(address, {
      auth: {
        refresh: { date, value: refresh },
        access: { date, value: access },
      },
    });

    if (!isSuccess) throw new Error("Failed to update refresh and access");

    return NextResponse.json({
      data: encrypt({ isSuccess: true, auth: { refresh, access } }),
    });
  } catch (error) {
    return NextResponse.json({
      data: encrypt({
        isSuccess: false,
        message: (error as Error).message || "Auth failed",
      }),
    });
  }
};

// update refresh and access
export const PATCH: Route = async (req) => {
  try {
    const { address, refresh } = await req.json();
    if (!address) throw new Error("Address is required");
    if (!isAddress(address)) throw new Error("Invalid address");
    if (!refresh) throw new Error("Refresh token is required");

    const user = await database(req.nextUrl).get(address);
    const storedRefresh = user?.auth?.refresh;
    if (!storedRefresh) throw new Error("Refresh token not found");

    const date = Date.now();

    if (storedRefresh.value !== refresh)
      throw new Error("Invalid refresh token");

    if (storedRefresh.date + LIFETIME.refresh * 1000 < date)
      throw new Error("Refresh token expired");

    const newRefresh = Math.random().toString(36).slice(2);
    const newAccess = Math.random().toString(36).slice(2);

    const { isSuccess } = await database(req.nextUrl).update(address, {
      auth: {
        refresh: { date, value: newRefresh },
        access: { date, value: newAccess },
      },
    });

    if (!isSuccess) throw new Error("Failed to update refresh and access");

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({
      isSuccess: false,
      message: (error as Error).message || "Auth failed",
    });
  }
};
