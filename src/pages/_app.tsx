import { type AppType } from "next/app";

import { Toaster } from "@/components/ui/toaster";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
      <Toaster />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
