import Head from "next/head";
import {
  serialize,
  hydrate,
  MDXClient,
  type SerializeOptions,
  type SerializeResult,
} from "next-mdx-remote-client/csr";

import { mdxComponentsWithContext as components } from "@/mdxComponents";
import { recmaPlugins, rehypePlugins, remarkPlugins } from "@/utils/mdx";
import DemoStateProvider from "@/contexts/DemoStateProvider";
import { getSource } from "@/utils/file";
import { getRandomInteger } from "@/utils";
import { type Frontmatter } from "@/types";

export default function TestPage({
  mdxSource,
}: {
  mdxSource: SerializeResult<Frontmatter>;
}) {
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

export async function getStaticProps() {
  const source = await getSource("test-context.mdx");

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: SerializeOptions = {
    parseFrontmatter: true,
    scope: { readingTime, props: { foo: "{props.foo} is working." } },
    vfileDataIntoScope: ["toc"], // the "remark-flexible-toc" plugin produces vfile.data.toc
    mdxOptions: {
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
