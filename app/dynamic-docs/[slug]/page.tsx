import { Suspense } from "react";
import type { Metadata } from "next";
import { type EvaluateOptions } from "next-mdx-remote-client/rsc";

import { getMarkdownFile, getMarkdownFiles, RE } from "@/utils/file";
import {
  getRemarkRehypeOptions,
  recmaPlugins,
  rehypePlugins,
  remarkPlugins,
} from "@/utils/mdx";
import { getRandomInteger, replaceLastDotWithDash } from "@/utils";
import TableResult from "@/components/TableResult";
import EvaluateComponent from "@/components/EvaluateComponent";
import LoadingComponent from "@/components/LoadingComponent";
import MDXRemoteComponent from "@/components/MDXRemoteComponent";
import ErrorComponent from "@/components/ErrorComponent";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { frontmatter } = (await getMarkdownFile(params.slug)) ?? {};

  return {
    title: frontmatter?.title ?? "Dynamic Docs",
  };
}

export async function generateStaticParams() {
  const files = getMarkdownFiles();

  const filteredFiles = files.filter(
    (filename) => !filename.includes("context") && !filename.includes("error")
  );

  return filteredFiles.map((filename) => ({
    slug: replaceLastDotWithDash(filename),
  }));
}

/**
 * For demonstration purpose, the both "hydrate" and "MDXClient" to be rendered
 */
export default async function Post({ params }: { params: { slug: string } }) {
  const result = await getMarkdownFile(params.slug);

  if (!result) return <ErrorComponent error="The source could not found !" />;

  const { source, format, frontmatter } = result;

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: EvaluateOptions = {
    disableExports: frontmatter?.disableExports,
    disableImports: frontmatter?.disableImports,
    parseFrontmatter: true,
    scope: { readingTime, props: { foo: "{props.foo} is working." } },
    vfileDataIntoScope: ["toc"], // the "remark-flexible-toc" plugin produces vfile.data.toc
    mdxOptions: {
      format,
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
      remarkRehypeOptions: getRemarkRehypeOptions(format),
      baseUrl: frontmatter?.disableImports ? undefined : import.meta.url,
    },
  };

  return (
    <TableResult leftColumnHeader="evaluate" rightColumnHeader="MDXRemote">
      {/* on the left */}
      <EvaluateComponent source={source} format={format} options={options} />

      {/* on the right */}
      <Suspense fallback={<LoadingComponent />}>
        <MDXRemoteComponent source={source} format={format} options={options} />
      </Suspense>
    </TableResult>
  );
}
