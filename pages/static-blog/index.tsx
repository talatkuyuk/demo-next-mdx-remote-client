import Head from "next/head";
import Link from "next/link";

export default function StaticBlog() {
  return (
    <>
      <Head>
        <title>Static Blog</title>
      </Head>
      <div>
        <strong>Wellcome to static blog</strong>
        <ul>
          <li>
            👉{" "}
            <Link href="/static-blog/test-basic">
              Test Disabled Imports/Exports
            </Link>{" "}
            <span>(Author: foofoo)</span>
          </li>
          <li>
            👉 <Link href="/static-blog/test-context">Test Context</Link>{" "}
            <span>(Author: barbar)</span>
          </li>
          <li>
            👉 <Link href="/static-blog/test-provider">Test Provider</Link>{" "}
            <span>(Author: foofoo)</span>
          </li>
          <li>
            👉{" "}
            <Link href="/static-blog/test-provider-outer">
              Test Provider Outer
            </Link>{" "}
            <span>(Author: foofoo)</span>
          </li>
          <li>
            👉 <Link href="/static-blog/test-error">Test Error</Link>{" "}
            <span>(Author: errorr)</span>
          </li>
          <li>
            👉{" "}
            <Link href="/static-blog/test-toc">
              Test Basic with Toc (Method-1)
            </Link>{" "}
            <span>(Author: toctoc)</span>
          </li>
          <li>
            👉{" "}
            <Link href="/static-blog/test-toc2">
              Test Basic with Toc (Method-2)
            </Link>{" "}
            <span>(Author: toctoc)</span>
          </li>
          <li>
            👉{" "}
            <Link href="/static-blog/test-full-client?slug=test-basic-mdx">
              Test Basic in Full Client
            </Link>{" "}
            <span>(Author: foofoo)</span>
          </li>
          <li>
            👉{" "}
            <Link href="/static-blog/test-full-client?slug=test-context-mdx">
              Test Context in Full Client
            </Link>{" "}
            <span>(Author: barbar)</span>
          </li>
          <li>
            👉 <Link href="/static-blog/test-markdown">Test Markdown File</Link>{" "}
            <span>(Author: markmark)</span>
          </li>
          <li>
            👉{" "}
            <Link href="/static-blog/test-async">
              Test Imports (Experimental) and Exports
            </Link>{" "}
            <span>(Author: asyncasync)</span>
          </li>
        </ul>
      </div>
    </>
  );
}
