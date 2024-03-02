import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import NavigationLoader from "@/components/NavigationLoader";
import Navigation from "@/components/Navbar";
import "@/styles/styles.css";
import "@/styles/hljs.css";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
// eslint-disable-next-line
import ErrorBoundaryInner from "@/components/ErrorBoundary2";
import ErrorComponent from "@/components/ErrorComponent";

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
      <ErrorBoundary
        errorComponent={(state) => <ErrorComponent error={state.error} />}
      >
        <Component {...pageProps} />
      </ErrorBoundary>
    </>
  );
}
