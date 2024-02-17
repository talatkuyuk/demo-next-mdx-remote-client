import { useEffect, useState } from "react";
import { serialize, type SerializeResult } from "next-mdx-remote-client/csr";

import { getRandomInteger } from "@/utils";
import {
  getRemarkRehypeOptions,
  recmaPlugins,
  rehypePlugins,
  remarkPlugins,
} from "@/utils/mdx";
import DemoStateProvider from "@/contexts/DemoStateProvider";
import { type Frontmatter } from "@/types";
import TableResult from "./TableResult";
import HydrateWithComponents from "./HydrateWithComponents";
import MDXClientWithComponents from "./MDXClientWithComponents";
import LoadingComponent from "./LoadingComponent";

type Props = React.PropsWithoutRef<{
  source: string;
  frontmatter: Frontmatter;
  format: "md" | "mdx";
}>;

/**
 * This component is created for only experimental purpose, to see any bug.
 */

const MDXFullClientComponent = ({ source, format, frontmatter }: Props) => {
  const [mdxSource, setMdxSource] = useState<
    SerializeResult<Frontmatter> | undefined
  >();

  useEffect(() => {
    async function getMdxSource() {
      const readingTime = `${getRandomInteger(4, 10)} min.`;

      const mdxSource_ = await serialize<Frontmatter>({
        source,
        options: {
          disableExports: frontmatter.disableExports,
          disableImports: true,
          parseFrontmatter: true,
          scope: { readingTime, props: { foo: "{props.foo} is working." } },
          vfileDataIntoScope: ["toc"], // the "remark-flexible-toc" plugin produces vfile.data.toc
          mdxOptions: {
            format,
            remarkPlugins,
            rehypePlugins,
            recmaPlugins,
            remarkRehypeOptions: getRemarkRehypeOptions(format),
          },
        },
      });

      setMdxSource(mdxSource_);
    }

    getMdxSource();
  }, []);

  if (!mdxSource)
    return (
      <TableResult leftColumnHeader="hydrate" rightColumnHeader="MDXClient">
        <LoadingComponent />
        <LoadingComponent />
      </TableResult>
    );

  return (
    <DemoStateProvider>
      <TableResult leftColumnHeader="hydrate" rightColumnHeader="MDXClient">
        {/* on the left */}
        <HydrateWithComponents
          mdxSource={mdxSource}
          data={{ source, format }}
        />

        {/* on the right */}
        <MDXClientWithComponents
          mdxSource={mdxSource}
          data={{ source, format }}
        />
      </TableResult>
    </DemoStateProvider>
  );
};

export default MDXFullClientComponent;
