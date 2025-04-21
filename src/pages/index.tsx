import Head from "next/head";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <>
      <Head>
        <title>Demand forecast dashboard</title>
      </Head>
      <Dashboard />
    </>
  );
}
