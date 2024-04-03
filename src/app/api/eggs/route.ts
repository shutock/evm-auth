import { type Route } from "@/lib";
import { NextResponse } from "next/server";

export const GET: Route = async () => {
  try {
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({
      isSuccess: false,
      message: (error as Error).message || "An error occurred",
    });
  }
};
