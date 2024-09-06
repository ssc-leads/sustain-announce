import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { Toaster } from "@/components/ui/toaster";
import { api } from "@/utils/api";

import "@/styles/globals.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Sustain Announce</title>
        <meta name="description" content="Announce sustain things!" />
      </Head>
      <div className={`w-full ${GeistSans.className}`}>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
