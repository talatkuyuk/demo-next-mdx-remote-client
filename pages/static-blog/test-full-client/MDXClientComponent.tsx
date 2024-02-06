import { useEffect, useState } from "react";
import {
  serialize,
  hydrate,
  MDXClient,
  type SerializeResult,
  type MDXComponents,
} from "next-mdx-remote-server/csr";

import { getRandomInteger } from "@/utils";
import { recmaPlugins, rehypePlugins, remarkPlugins } from "@/utils/mdx";
import DemoStateProvider from "@/contexts/DemoStateProvider";

/**
 * This component is created for only experimental purpose, to see any bug.
 */

const MDXClientComponent = ({
  body,
  components,
}: React.PropsWithoutRef<{
  body: string;
  components: MDXComponents;
}>) => {
  const [mdxSource, setMdxSource] = useState<SerializeResult | undefined>();

  useEffect(() => {
    const readingTime = `${getRandomInteger(4, 10)} min.`;

    serialize({
      source: body,
      options: {
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

  const { compiledSource, ...options } = mdxSource ?? {};

  if (!compiledSource) return <p>Loading the article...</p>;

  const { content, mod } = hydrate({ compiledSource, options, components });

  // "It has been proven that the variables exported from the mdx document are exported completely and correctly."
  const proofForExports =
    (mod as any)?.factorial?.((mod as any)?.num) === 720
      ? "validated exports"
      : "invalidated exports";

  return (
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
              <MDXClient
                compiledSource={compiledSource}
                options={options}
                components={components}
              />
            </DemoStateProvider>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MDXClientComponent;
