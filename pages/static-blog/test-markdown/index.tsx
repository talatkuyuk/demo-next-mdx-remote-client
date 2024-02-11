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
 * renders for both "hydrate" and "MDXClient"
 */
export default function TestPage({
  mdxSource,
}: {
  mdxSource: SerializeResult<Frontmatter>;
}) {
  const { content, mod } = hydrate({
    ...mdxSource,
    components,
  });

  // "It has been proven that all exports in the mdx document are removed."
  const proofForNoAnyExports =
    Object.keys(mod).length === 0
      ? "all exports removed"
      : "invalidated removed exports";

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
                <strong>{proofForNoAnyExports}</strong>
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
  const source = await getSource("test-markdown.md");

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: SerializeOptions = {
    disableExports: true,
    parseFrontmatter: true,
    scope: { readingTime, props: { foo: "{props.foo} is working." } },
    mdxOptions: {
      format: "md",
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
      development: process.env.NODE_ENV === "development", // for experimental
    },
  };

  const mdxSource = await serialize<Frontmatter>({
    source,
    options,
  });

  return { props: { mdxSource } };
}
