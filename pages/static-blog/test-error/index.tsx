import Head from "next/head";
import {
  serialize,
  hydrate,
  MDXClient,
  type SerializeOptions,
  type SerializeResult,
} from "next-mdx-remote-client/csr";

import { recmaPlugins, rehypePlugins, remarkPlugins } from "@/utils/mdx";
import { mdxComponents as components } from "@/mdxComponents";
import { getSource } from "@/utils/file";
import { getRandomInteger } from "@/utils";
import { type Frontmatter } from "@/types";

/**
 * implements an error handling algorithm in client side rendering
 */
export default function TestPage({
  mdxSource,
}: {
  mdxSource: SerializeResult<Frontmatter>;
}) {
  if (mdxSource.hasOwnProperty("error")) {
    return (
      <>
        <Head>
          <title>MDX Compile Error</title>
        </Head>
        <table className="result">
          <thead>
            <tr>
              <td>
                <mark>MDX Source</mark>
              </td>
              <td>
                <mark>MDX Compile Error</mark>
              </td>
              <td>
                <mark>
                  with using <strong>MDXClient</strong>
                </mark>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <pre>
                  <code className="language-mdx">
                    {(mdxSource as any).source}
                  </code>
                </pre>
              </td>
              <td>
                <pre>
                  <code style={{ color: "red" }}>
                    {(mdxSource as any).error}
                  </code>
                </pre>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  const { content, mod } = hydrate({
    ...mdxSource,
    components,
  });

  // "It has been proven that the variables exported from the mdx document are exported completely and correctly."
  const proofForExports =
    (mod as any)?.factorial?.((mod as any)?.num) === 720
      ? "validated exports"
      : "invalidated exports";

  return (
    <>
      <Head>
        <title>{mdxSource.frontmatter.title}</title>
      </Head>
      <table className="result">
        <thead>
          <tr>
            <td>
              <mark>
                with using <strong>hydrate</strong>
              </mark>
              <span className="proof-for-exports">
                <strong>{proofForExports}</strong>
              </span>
            </td>
            <td>
              <mark>
                with using <strong>MDXClient</strong>
              </mark>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{content}</td>
            <td>
              <MDXClient {...mdxSource} components={components} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export async function getStaticProps() {
  const source = await getSource("test-error.mdx");

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: SerializeOptions = {
    parseFrontmatter: true,
    scope: { readingTime, props: { foo: "{props.foo} is working." } },
    vfileDataIntoScope: ["toc"], // the "remark-flexible-toc" plugin produces vfile.data.toc
    mdxOptions: {
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
      development: process.env.NODE_ENV === "development", // for experimental
    },
  };

  try {
    const mdxSource = await serialize<Frontmatter>({
      source,
      options,
    });

    return { props: { mdxSource } };
  } catch (error) {
    return {
      props: {
        mdxSource: {
          source,
          error: (error as Error).message,
        },
      },
    };
  }
}
