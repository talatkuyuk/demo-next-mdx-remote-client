import {
  MDXClientLazy,
  type SerializeResult,
} from "next-mdx-remote-client/csr";

import SourceComponent from "./SourceComponent";
import ErrorComponent from "./ErrorComponent";

import { type Frontmatter } from "@/types";
import { mdxComponentsWithContext as components } from "@/mdxComponents";

type Props = {
  mdxSource: SerializeResult<Frontmatter>;
  data: {
    format: "md" | "mdx";
    source: string;
  };
};

const MDXClientLazyComponent = ({ mdxSource, data }: Props) => {
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
      <MDXClientLazy
        {...mdxSource}
        components={components}
        onError={ErrorComponent} // if not provided, you should use an error boundary
      />

      {/* Just for format prop to show */}
      <span className="right-corner-absolute-note">
        <strong>{data.format === "md" ? "markdown" : "mdx"}</strong>
      </span>
    </>
  );
};

export default MDXClientLazyComponent;
