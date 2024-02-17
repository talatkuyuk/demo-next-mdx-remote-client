import { type SerializeResult } from "next-mdx-remote-client/csr";

import TableResult from "./TableResult";
import HydrateWithComponents from "./HydrateWithComponents";
import HydrateWithoutComponents from "./HydrateWithoutComponents";
import MDXClientWithComponents from "./MDXClientWithComponents";
import MDXClientWithoutComponents from "./MDXClientWithoutComponents";

import { type Frontmatter } from "@/types";

type Props = {
  mdxSource: SerializeResult<Frontmatter>;
  data: {
    format: "md" | "mdx";
    source: string;
  };
  hasProviderForComponents?: boolean;
};

/**
 *
 * For demonstration purpose, the both "hydrate" and "MDXClient" to be rendered
 */
const MDXResultComponent = ({ mdxSource, data }: Props) => {
  return (
    <TableResult leftColumnHeader="evaluate" rightColumnHeader="MDXRemote">
      {/* on the left */}
      <HydrateWithComponents mdxSource={mdxSource} data={data} />

      {/* on the right */}
      <MDXClientWithComponents mdxSource={mdxSource} data={data} />
    </TableResult>
  );
};

export default MDXResultComponent;
