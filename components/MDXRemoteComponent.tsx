import { type MDXRemoteOptions, MDXRemote } from "next-mdx-remote-client/rsc";

import ErrorComponent from "./ErrorComponent";

import { mdxComponentsWithContext as components } from "@/mdxComponents";
import SourceComponent from "./SourceComponent";

type Props = {
  source?: string;
  format: "md" | "mdx";
  options: MDXRemoteOptions;
};

const MDXRemoteComponent = ({ source, format, options }: Props) => {
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

  function onError({ error }: { error: Error }) {
    return (
      <>
        <ErrorComponent error={error} />
        <SourceComponent source={source!} />
      </>
    );
  }

  return (
    <>
      <MDXRemote
        source={source}
        options={options}
        components={components}
        onError={onError} // Some errors couldn't be catched, you should use an error boundary
      />

      {/* Just for format prop to show */}
      <span className="right-corner-absolute-note">
        <strong>{format === "md" ? "markdown" : "mdx"}</strong>
      </span>
    </>
  );
};

export default MDXRemoteComponent;
