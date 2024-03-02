import Head from "next/head";
import {
  serialize,
  type SerializeOptions,
  type SerializeResult,
} from "next-mdx-remote-client/serialize";
import { MDXProvider } from "next-mdx-remote-client/csr";

import {
  getRemarkRehypeOptions,
  recmaPlugins,
  rehypePlugins,
  remarkPlugins,
} from "@/utils/mdx";
import { mdxComponents as components } from "@/mdxComponents";
import { getSource } from "@/utils/file";
import { getMarkdownExtension, getRandomInteger } from "@/utils";
import { type Frontmatter } from "@/types";
import ErrorComponent from "@/components/ErrorComponent";
import TableResult from "@/components/TableResult";
import HydrateWithoutComponents from "@/components/HydrateWithoutComponents";
import MDXClientWithoutComponents from "@/components/MDXClientWithoutComponents";

type Props = {
  mdxSource?: SerializeResult<Frontmatter>;
  data?: {
    format: "md" | "mdx";
    source: string;
  };
};

/**
 * For demonstration purpose, the both "hydrate" and "MDXClient" to be rendered
 *
 * implements MDXProvider usage
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

  return (
    <>
      <Head>
        <title>{mdxSource.frontmatter.title}</title>
      </Head>

      <MDXProvider components={components}>
        <TableResult leftColumnHeader="hydrate" rightColumnHeader="MDXClient">
          {/* on the left */}
          <HydrateWithoutComponents mdxSource={mdxSource} data={data} />

          {/* on the right */}
          <MDXClientWithoutComponents mdxSource={mdxSource} data={data} />
        </TableResult>
      </MDXProvider>
    </>
  );
}

export async function getStaticProps() {
  const file = "test-basic.mdx";
  const format = getMarkdownExtension(file);
  const source = await getSource(file);

  if (!source) {
    return {
      props: {},
    };
  }

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: SerializeOptions = {
    disableImports: true,
    disableExports: true,
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
