import Head from "next/head";
import {
  serialize,
  hydrate,
  MDXClient,
  type SerializeOptions,
  type SerializeResult,
} from "next-mdx-remote-client/csr";

import {
  getRemarkPlugins,
  recmaPlugins,
  rehypePlugins,
  remarkPlugins,
} from "@/utils/mdx";
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
  mdxSource1,
  mdxSource2,
}: {
  mdxSource1: SerializeResult<Frontmatter>;
  mdxSource2: SerializeResult<Frontmatter>;
}) {
  const { content, mod } = hydrate({ ...mdxSource1, components });

  const { compiledSource: compiledSource2, ...options2 } = mdxSource2;

  // "It has been proven that the variables exported from the mdx document are exported completely and correctly."
  const proofForExports =
    (mod as any)?.factorial?.((mod as any)?.num) === 720
      ? "validated exports"
      : "invalidated exports";

  return (
    <>
      <Head>
        <title>{mdxSource1.frontmatter.title}</title>
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
              <MDXClient {...mdxSource2} components={components} />
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

  const serializeOptions1: SerializeOptions = {
    parseFrontmatter: true,
    // here, we insert the "toc" inside the "scope" ourselves
    scope: { readingTime, props: { foo: "{props.foo} is working." }, toc },
    mdxOptions: {
      remarkPlugins: getRemarkPlugins(toc), // the "remark-flexible-toc" plugin mutates the "toc"
      rehypePlugins,
      recmaPlugins,
      development: process.env.NODE_ENV === "development", // for experimental
    },
  };

  // now, another simple way to get the table of content
  const serializeOptions2: SerializeOptions = {
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

  // We call the serialize function twice with different options,
  // In order to show two ways of getting "toc".

  const mdxSource1 = await serialize<Frontmatter>({
    source,
    options: serializeOptions1,
  });

  const mdxSource2 = await serialize<Frontmatter>({
    source,
    options: serializeOptions2,
  });

  return { props: { mdxSource1, mdxSource2 } };
}
