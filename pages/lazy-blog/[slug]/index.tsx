import Head from "next/head";
import {
  serialize,
  type SerializeOptions,
  type SerializeResult,
} from "next-mdx-remote-client/serialize";

import type { Frontmatter } from "@/types";
import {
  getRemarkRehypeOptions,
  recmaPlugins,
  rehypePlugins,
  remarkPlugins,
} from "@/utils/mdx";
import { getMarkdownFile, getMarkdownFiles } from "@/utils/file";
import { getRandomInteger, replaceLastDotWithDash } from "@/utils";
import DemoStateProvider from "@/contexts/DemoStateProvider";
import ErrorComponent from "@/components/ErrorComponent";
import TableResult from "@/components/TableResult";
import HydrateLazyComponent from "@/components/HydrateLazyComponent";
import MDXClientLazyComponent from "@/components/MDXClientLazyComponent";

type Props = {
  mdxSource?: SerializeResult<Frontmatter>;
  data?: {
    format: "md" | "mdx";
    source: string;
  };
};

/**
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

  return (
    <>
      <Head>
        <title>{mdxSource.frontmatter.title}</title>
      </Head>

      <DemoStateProvider>
        <TableResult leftColumnHeader="hydrate" rightColumnHeader="MDXClient">
          {/* on the left */}
          <HydrateLazyComponent mdxSource={mdxSource} data={data} />

          {/* on the right */}
          <MDXClientLazyComponent mdxSource={mdxSource} data={data} />
        </TableResult>
      </DemoStateProvider>
    </>
  );
}

export async function getStaticPaths() {
  const files = getMarkdownFiles();

  const filteredFiles = files.filter(
    (filename) => !filename.includes("esm") && !filename.includes("error")
  );

  const paths = filteredFiles.map((filename) => ({
    params: { slug: replaceLastDotWithDash(filename) },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const result = await getMarkdownFile(params.slug);

  if (!result) {
    return {
      props: {},
    };
  }

  const { source, format, frontmatter } = result;

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: SerializeOptions = {
    disableExports: frontmatter?.disableExports,
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
