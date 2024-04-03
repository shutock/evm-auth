import { NextResponse } from "next/server";
import { isAddress, type Address } from "viem";

import { type User, type Route } from "@/lib";

const storage = new Map<Address, User>();

console.log(storage);

export const GET: Route<{ address: string }> = async (
  _,
  { params: { address } }
) => {
  try {
    if (!isAddress(address)) throw new Error("Invalid key");

    return NextResponse.json(storage.get(address));
  } catch (error) {
    return NextResponse.json({
      isSuccess: false,
      message: (error as Error).message || "An error occurred",
    });
  }
};

export const POST: Route<{ address: string }> = async (
  req,
  { params: { address } }
) => {
  try {
    if (!isAddress(address)) throw new Error("Invalid key");

    storage.set(address, await req.json());

    return NextResponse.json(storage.get(address));
  } catch (error) {
    return NextResponse.json({
      isSuccess: false,
      message: (error as Error).message || "An error occurred",
    });
  }
};

export const PATCH: Route<{ address: string }> = async (
  req,
  { params: { address } }
) => {
  try {
    if (!isAddress(address)) throw new Error("Invalid key");
    if (!storage.has(address)) throw new Error("Key not found");
    storage.set(address, { ...storage.get(address), ...(await req.json()) });
    return NextResponse.json(storage.get(address));
  } catch (error) {
    return NextResponse.json({
      isSuccess: false,
      message: (error as Error).message || "An error occurred",
    });
  }
};

export const DELETE: Route<{ address: string }> = async (
  {},
  { params: { address } }
) => {
  try {
    if (!isAddress(address)) throw new Error("Invalid key");
    if (!storage.has(address)) throw new Error("Key not found");
    storage.delete(address);
    return NextResponse.json({ isSuccess: true });
  } catch (error) {
    return NextResponse.json({
      isSuccess: false,
      message: (error as Error).message || "An error occurred",
    });
  }
};
