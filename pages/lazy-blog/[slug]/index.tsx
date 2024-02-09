import Head from "next/head";
import {
  serialize,
  hydrateLazy,
  MDXClientLazy,
  type SerializeOptions,
  type SerializeResult,
} from "next-mdx-remote-client/csr";

import type { Frontmatter } from "@/types";
import { recmaPlugins, rehypePlugins, remarkPlugins } from "@/utils/mdx";
import { RE, getMarkdownFile, getMarkdownFiles } from "@/utils/file";
import { getRandomInteger } from "@/utils";
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
  const { content, mod } = hydrateLazy({ ...mdxSource, components });

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
            <td>
              <DemoStateProvider>{content}</DemoStateProvider>
            </td>
            <td>
              <DemoStateProvider>
                <MDXClientLazy {...mdxSource} components={components} />
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
    params: { slug: filename.replace(RE, "") },
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
