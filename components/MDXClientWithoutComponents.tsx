import { MDXClient, type SerializeResult } from "next-mdx-remote-client/csr";

import SourceComponent from "./SourceComponent";
import ErrorComponent from "./ErrorComponent";

import { type Frontmatter } from "@/types";

type Props = {
  mdxSource: SerializeResult<Frontmatter>;
  data: {
    format: "md" | "mdx";
    source: string;
  };
};

const MDXClientWithoutComponents = ({ mdxSource, data }: Props) => {
  if ("error" in mdxSource)
    return (
      <>
        <ErrorComponent error={mdxSource.error} />
        <SourceComponent source={data.source} />

        {/* Just for giving an appropriate message */}
        <span className="right-corner-absolute-note">
          <strong>Syntax Error</strong>
        </span>
      </>
    );

  return (
    <>
      <MDXClient
        {...mdxSource}
        onError={ErrorComponent} // if not provided, you should use an error boundary
      />

      {/* Just for format prop to show */}
      <span className="right-corner-absolute-note">
        <strong>{data.format === "md" ? "markdown" : "mdx"}</strong>
      </span>
    </>
  );
};

export default MDXClientWithoutComponents;
