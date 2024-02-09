import { useEffect, useState } from "react";
import {
  serialize,
  hydrate,
  MDXClient,
  type SerializeResult,
  type MDXComponents,
} from "next-mdx-remote-client/csr";

import { getRandomInteger } from "@/utils";
import { recmaPlugins, rehypePlugins, remarkPlugins } from "@/utils/mdx";
import DemoStateProvider from "@/contexts/DemoStateProvider";
import { type Frontmatter } from "@/types";

/**
 * This component is created for only experimental purpose, to see any bug.
 */

const MDXClientComponent = ({
  body,
  components,
  frontmatter,
}: React.PropsWithoutRef<{
  body: string;
  components: MDXComponents;
  frontmatter: Frontmatter;
}>) => {
  const [mdxSource, setMdxSource] = useState<SerializeResult | undefined>();

  useEffect(() => {
    const readingTime = `${getRandomInteger(4, 10)} min.`;

    serialize({
      source: body,
      options: {
        disableExports: frontmatter.disableExports,
        parseFrontmatter: true,
        scope: { readingTime, props: { foo: "{props.foo} is working." } },
        vfileDataIntoScope: ["toc"], // the "remark-flexible-toc" plugin produces vfile.data.toc
        mdxOptions: {
          remarkPlugins,
          rehypePlugins,
          recmaPlugins,
        },
      },
    }).then((result) => {
      setMdxSource(result);
    });
  }, [body]);

  if (!mdxSource) return <p>Loading the article...</p>;

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
  );
};

export default MDXClientComponent;
