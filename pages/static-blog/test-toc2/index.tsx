import Head from "next/head";
import {
  serialize,
  hydrate,
  MDXClient,
  type SerializeOptions,
  type SerializeResult,
} from "next-mdx-remote-client/csr";

import { getRemarkPlugins, recmaPlugins, rehypePlugins } from "@/utils/mdx";
import { mdxComponents as components } from "@/mdxComponents";
import { getSource } from "@/utils/file";
import { getRandomInteger } from "@/utils";
import { type Frontmatter } from "@/types";
import { type TocItem } from "@/utils/plugin";

/**
 * renders for both "hydrate" and "MDXClient"
 *
 * implements two ways of getting the Table of Contents (TOC)
 */
export default function TestPage({
  mdxSource,
}: {
  mdxSource: SerializeResult<Frontmatter>;
}) {
  const { content, mod } = hydrate({ ...mdxSource, components });

  // "It has been proven that the exports from the mdx are validated."
  const proofForValidatedExports =
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
                <strong>{proofForValidatedExports}</strong>
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
  const source = await getSource("test-toc.mdx");

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  // get the table of content (toc) in a different way instead of vfileDataIntoScope: ["toc"]
  const toc: TocItem[] = [];

  const options: SerializeOptions = {
    parseFrontmatter: true,
    // we insert the "toc" inside the "scope" ourselves
    scope: { toc, readingTime, props: { foo: "{props.foo} is working." } },
    mdxOptions: {
      remarkPlugins: getRemarkPlugins(toc), // the "remark-flexible-toc" plugin mutates the "toc"
      rehypePlugins,
      recmaPlugins,
      development: process.env.NODE_ENV === "development", // for experimental
    },
  };

  // We call the serialize function twice with different options,
  // In order to show two ways of getting "toc".

  const mdxSource = await serialize<Frontmatter>({
    source,
    options,
  });

  return { props: { mdxSource } };
}
