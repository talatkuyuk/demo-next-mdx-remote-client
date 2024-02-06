import Head from "next/head";
import {
  serialize,
  hydrate,
  MDXClient,
  MDXProvider,
  type SerializeOptions,
  type SerializeResult,
} from "next-mdx-remote-server/csr";

import { recmaPlugins, rehypePlugins, remarkPlugins } from "@/utils/mdx";
import { mdxComponents as components } from "@/mdxComponents";
import { getSource } from "@/utils/file";
import { getRandomInteger } from "@/utils";
import { type Frontmatter } from "@/types";

/**
 * renders for both "hydrate" and "MDXClient"
 *
 * implements MDXProvider usage
 */
export default function TestPage({
  mdxSource,
}: {
  mdxSource: SerializeResult<Frontmatter>;
}) {
  const { compiledSource, ...options } = mdxSource;

  // since we didn't provide the components, it does not wrap with the <MDXProvider />
  const { content, mod } = hydrate({
    compiledSource,
    options,
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
      {/* Here we can provide the components wrapping with the <MDXProvider /> for both  */}
      <MDXProvider components={components}>
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
                {/* since we didn't provide the components, it does not wrap with the <MDXProvider /> */}
                <MDXClient compiledSource={compiledSource} options={options} />
              </td>
            </tr>
          </tbody>
        </table>
      </MDXProvider>
    </>
  );
}

export async function getStaticProps() {
  const source = await getSource("test-basic.mdx");

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

  const mdxSource = await serialize<Frontmatter>({
    source,
    options,
  });

  return { props: { mdxSource } };
}
