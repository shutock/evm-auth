"use client";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { symbols } from "@/lib";

import "@/sass/globals.scss";

export const Styles: React.FC = () => {
  return (
    <>
      <style jsx global>{`
        html {
          --font-family-sans: ${GeistSans.style.fontFamily};
          --font-family-mono: ${GeistMono.style.fontFamily};
          --font-family-symbols: ${symbols.style.fontFamily};
        }
      `}</style>
    </>
  );
};
