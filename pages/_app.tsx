import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import NavigationLoader from "@/components/NavigationLoader";
import Navigation from "@/components/navigation";
import "@/styles/styles.css";
import "@/styles/hljs.css";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Navigation />
      <NavigationLoader />
      <Component {...pageProps} />
    </>
  );
}
