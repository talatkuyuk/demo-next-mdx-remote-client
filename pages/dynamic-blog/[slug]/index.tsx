import Head from "next/head";
import {
  serialize,
  hydrate,
  MDXClient,
  type SerializeOptions,
  type SerializeResult,
} from "next-mdx-remote-client/csr";

import type { Frontmatter } from "@/types";
import { RE, getMarkdownFile, getMarkdownFiles } from "@/utils/file";
import { recmaPlugins, rehypePlugins, remarkPlugins } from "@/utils/mdx";
import { getRandomInteger, replaceLastDotWithDash } from "@/utils";
import DemoStateProvider from "@/contexts/DemoStateProvider";
import { mdxComponentsWithContext as components } from "@/mdxComponents";

/**
 * renders for both "hydrate" and "MDXClient"
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
                <strong>
                  {mdxSource.frontmatter.disableExports
                    ? proofForNoAnyExports
                    : proofForValidatedExports}
                </strong>
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
            <td>
              <DemoStateProvider>{content}</DemoStateProvider>
            </td>
            <td>
              <DemoStateProvider>
                <MDXClient {...mdxSource} components={components} />
              </DemoStateProvider>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export async function getStaticPaths() {
  const files = getMarkdownFiles();

  const filteredFiles = files.filter(
    (filename) => !filename.includes("esm") && !filename.includes("error")
  );

  const paths = filteredFiles.map((filename) => ({
    params: { slug: replaceLastDotWithDash(filename) },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const { source, format, frontmatter } =
    (await getMarkdownFile(params.slug)) ?? {};

  if (!source) {
    return {
      props: {
        source: null, // undefined is not serializable
      },
    };
  }

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: SerializeOptions = {
    disableExports: frontmatter?.disableExports,
    parseFrontmatter: true,
    scope: { readingTime, props: { foo: "{props.foo} is working." } },
    vfileDataIntoScope: ["toc"], // the "remark-flexible-toc" plugin produces vfile.data.toc
    mdxOptions: {
      format,
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
    },
  };

  const mdxSource = await serialize<Frontmatter>({
    source,
    options,
  });

  return { props: { mdxSource } };
}
