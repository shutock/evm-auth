import { type NextResponse, type NextRequest } from "next/server";
import { type ImageResponse } from "next/og";

export type Route<T = object> = (
  req: NextRequest,
  {}: { params: T }
) => Promise<NextResponse | ImageResponse>;
