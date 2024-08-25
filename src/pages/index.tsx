import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import SharedForm from "@/pages/form";

export default function Home() {
  return (
    <>
      <Head>
        <title>Sustain Announce</title>
        <meta name="description" content="Announce sustain things!" />
      </Head>
      <div className="w-full">
        <SharedForm />
      </div>
    </>
  );
}
