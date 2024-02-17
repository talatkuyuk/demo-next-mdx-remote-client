import { hydrate, type SerializeResult } from "next-mdx-remote-client/csr";

import SourceComponent from "./SourceComponent";
import ErrorComponent from "./ErrorComponent";

import { type Frontmatter } from "@/types";
import { validateExports } from "@/utils";
import { mdxComponentsWithContext as components } from "@/mdxComponents";

type Props = {
  mdxSource: SerializeResult<Frontmatter>;
  data: {
    format: "md" | "mdx";
    source: string;
  };
};

/**
 * It is designed for showing mdx export support,
 * so it is a little overcomplicated, but you don't need do the same
 */
const MDXHydrateWithComponents = ({ mdxSource, data }: Props) => {
  if ("error" in mdxSource)
    return (
      <>
        <ErrorComponent error={mdxSource.error} />
        <SourceComponent source={data.source} />

        {/* Just for giving an appropriate message */}
        <span className="left-corner-absolute-note">
          <strong>Syntax Error</strong>
        </span>
      </>
    );

  const { content, mod, error } = hydrate({ ...mdxSource, components });

  /* for validating exports */
  const proofForExports = validateExports(
    data.format,
    mod,
    mdxSource.frontmatter.disableExports
  );

  return (
    <>
      {error ? <ErrorComponent error={error} /> : content}

      {/* Just for a message about validating exports */}
      <span className="left-corner-absolute-note">
        <strong>{proofForExports}</strong>
      </span>
    </>
  );
};

export default MDXHydrateWithComponents;
