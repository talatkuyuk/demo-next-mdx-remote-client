import Link from "next/link";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Static Docs",
};

export default async function Docs() {
  return (
    <div>
      <strong>Wellcome to static docs</strong>
      <ul>
        <li>
          👉 <Link href="/static-docs/test-basic">Test Basic</Link>{" "}
          <span>(Author: foofoo)</span>
        </li>
        <li>
          👉 <Link href="/static-docs/test-toc">Test Basic with Toc</Link>{" "}
          <span>(Author: toctoc)</span>
        </li>
        <li>
          👉 <Link href="/static-docs/test-error">Test Basic with Error</Link>{" "}
          <span>(Author: errorr)</span>
        </li>
        <li>
          👉 <Link href="/static-docs/test-esm">Test ESM</Link>{" "}
          <span>(Author: esmesm)</span>
        </li>
      </ul>
    </div>
  );
}
