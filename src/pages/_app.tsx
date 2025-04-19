import "@ingka/button/style.scss";
import "@ingka/base/style.scss";
import "@ingka/focus/style.scss";
import "@ingka/forms/style.scss";
import "@ingka/grid/style.scss";
import "@ingka/list-view/style.scss";
import "@ingka/pill/style.scss";
import "@ingka/table/style.scss";
import "@ingka/text/style.scss";
import "react-day-picker/style.css";

import "@/styles/styles.scss";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
