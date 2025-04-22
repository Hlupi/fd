import Head from "next/head";
import "@ingka/button/style.scss";
import "@ingka/base/style.scss";
import "@ingka/focus/style.scss";
import "@ingka/forms/style.scss";
import "@ingka/grid/style.scss";
import "@ingka/list-view/style.scss";
import "@ingka/pill/style.scss";
import "@ingka/table/style.scss";
import "@ingka/text/style.scss";
import "@ingka/svg-icon/style.scss";
import "@ingka/search/style.scss";
import "@ingka/skeleton/style.scss";
import "@ingka/modal/style.scss";
import "react-day-picker/style.css";

import "@/styles/styles.scss";

import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Demand forecast</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}
