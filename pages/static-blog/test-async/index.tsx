import Head from "next/head";
import {
  serialize,
  hydrateAsync,
  MDXClientAsync,
  type SerializeOptions,
  type SerializeResult,
} from "next-mdx-remote-client/csr";

import {
  getRemarkRehypeOptions,
  recmaPlugins,
  rehypePlugins,
  remarkPlugins,
} from "@/utils/mdx";
import { mdxComponents as components } from "@/mdxComponents";
import { getSourceFromPath } from "@/utils/file";
import { getRandomInteger, validateExports } from "@/utils";
import { type Frontmatter } from "@/types";
import ErrorComponent from "@/components/ErrorComponent";
import TableResult from "@/components/TableResult";
import CompiledSourceComponent from "@/components/CompiledSourceComponent";
import LoadingComponent from "@/components/LoadingComponent";
import SourceComponent from "@/components/SourceComponent";

type Props = {
  mdxSource?: SerializeResult<Frontmatter>;
  data?: {
    format: "md" | "mdx";
    source: string;
  };
};

/**
 * This page is experimental for importing a module specified in the mdx on the client side
 *
 * For demonstration purpose, the both "hydrate" and "MDXClient" to be rendered
 */
export default function TestPage({ mdxSource, data }: Props) {
  if (!data || !mdxSource) {
    return (
      <>
        <Head>
          <title>Static Blog</title>
        </Head>

        <ErrorComponent error="The source could not found !" />
      </>
    );
  }

  if ("error" in mdxSource)
    return (
      <TableResult
        leftColumnHeader="hydrateAsync"
        rightColumnHeader="MDXClientAsync"
      >
        <>
          <ErrorComponent error={mdxSource.error} />
          <SourceComponent source={data.source} />

          {/* Just for giving an appropriate message */}
          <span className="left-corner-absolute-note">
            <strong>Syntax Error</strong>
          </span>
        </>

        <>
          <ErrorComponent error={mdxSource.error} />
          <SourceComponent source={data.source} />

          {/* Just for giving an appropriate message */}
          <span className="right-corner-absolute-note">
            <strong>Syntax Error</strong>
          </span>
        </>
      </TableResult>
    );

  const remote_url =
    "https://gist.githubusercontent.com/talatkuyuk/77add43c41fdfb197244ab9a43cba9d2/raw/f23d37aed3fa54f6f1ded8f654c081bbf3c07b63/Bar.mjs";

  const options = {
    baseUrl: import.meta.url,
    // baseUrl: remote_url,
  };

  const loading = () => <LoadingComponent />;

  const onError = ({ error }: { error: Error }) => (
    <>
      <ErrorComponent error={error} />
      <CompiledSourceComponent compiledSource={mdxSource.compiledSource} />
    </>
  );

  const { content, mod, error } = hydrateAsync({
    ...mdxSource,
    components,
    options,
    loading,
  });

  /* for validating exports */
  const proofForExports = validateExports(
    data.format,
    mod,
    mdxSource.frontmatter.disableExports
  );

  return (
    <>
      <Head>
        <title>{mdxSource.frontmatter.title}</title>
      </Head>
      <TableResult
        leftColumnHeader="hydrateAsync"
        rightColumnHeader="MDXClientAsync"
      >
        {/* on the left */}
        <>
          {error ? onError({ error }) : content}

          {/* Just for a message about validating exports */}
          <span className="left-corner-absolute-note">
            <strong>{proofForExports}</strong>
          </span>
        </>

        {/* on the right */}
        <>
          <MDXClientAsync
            {...mdxSource}
            components={components}
            options={options}
            loading={loading}
            onError={onError} // if not provided, you should use an error boundary
          />

          {/* Just for format prop to show */}
          <span className="right-corner-absolute-note">
            <strong>{data.format === "md" ? "markdown" : "mdx"}</strong>
          </span>
        </>
      </TableResult>
    </>
  );
}

export async function getStaticProps() {
  const source = await getSourceFromPath(
    "pages/static-blog/test-async/test-async.mdx"
  );
  const format = "mdx";

  if (!source) {
    return {
      props: {},
    };
  }

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: SerializeOptions = {
    parseFrontmatter: true,
    scope: { readingTime, props: { foo: "{props.foo} is working." } },
    mdxOptions: {
      format,
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
      remarkRehypeOptions: getRemarkRehypeOptions(format),
      development: process.env.NODE_ENV === "development", // for experimental
    },
  };

  const mdxSource = await serialize<Frontmatter>({
    source,
    options,
  });

  return {
    props: {
      mdxSource,
      data: {
        source, // I pass it for showing in case syntax error
        format, // I pass it for composing a message for validating exports
      },
    },
  };
}
