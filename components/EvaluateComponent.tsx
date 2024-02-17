import { type EvaluateOptions, evaluate } from "next-mdx-remote-client/rsc";

import SourceComponent from "./SourceComponent";
import ErrorComponent from "./ErrorComponent";

import { type Frontmatter } from "@/types";
import { validateExports } from "@/utils";
import { mdxComponents as components } from "@/mdxComponents";

type Props = {
  source?: string;
  format: "md" | "mdx";
  options: EvaluateOptions;
};

/**
 * It is designed for showing mdx export support,
 * so it is a little overcomplicated, but you don't need do the same
 */
const EvaluateComponent = async ({ source, format, options }: Props) => {
  if (!source)
    return (
      <>
        <ErrorComponent error="The source could not found !" />

        {/* Just for giving an appropriate message */}
        <span className="left-corner-absolute-note">
          <strong>Error</strong>
        </span>
      </>
    );

  const { content, mod, frontmatter, error } = await evaluate<Frontmatter>({
    source,
    options,
    components,
  });

  if (error)
    return (
      <>
        <ErrorComponent error={error} />
        <SourceComponent source={source} />

        {/* Just for giving an appropriate message */}
        <span className="left-corner-absolute-note">
          <strong>{error.name}</strong>
        </span>
      </>
    );

  /* for validating exports */
  const proofForExports = validateExports(
    format,
    mod,
    frontmatter.disableExports
  );

  return (
    <>
      {content}

      {/* Just for a message about validating exports */}
      <span className="left-corner-absolute-note">
        <strong>{proofForExports}</strong>
      </span>
    </>
  );
};

export default EvaluateComponent;
