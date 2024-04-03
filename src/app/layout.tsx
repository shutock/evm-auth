import { type Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Nomis Easter Event",
  description: "Test page",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
};

export default RootLayout;
