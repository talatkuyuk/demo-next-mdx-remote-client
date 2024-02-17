import { Suspense } from "react";
import { type Metadata } from "next";
import { getFrontmatter } from "next-mdx-remote-client/utils";
import { type EvaluateOptions } from "next-mdx-remote-client/rsc";

import {
  remarkPlugins,
  rehypePlugins,
  recmaPlugins,
  getRemarkRehypeOptions,
  getRemarkPlugins,
} from "@/utils/mdx";
import type { Frontmatter } from "@/types";
import { getSource } from "@/utils/file";
import { getMarkdownExtension, getRandomInteger } from "@/utils";
import TableResult from "@/components/TableResult";
import EvaluateComponent from "@/components/EvaluateComponent";
import MDXRemoteComponent from "@/components/MDXRemoteComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { type TocItem } from "@/utils/plugin";

export async function generateMetadata(): Promise<Metadata> {
  const source = await getSource("test-basic.mdx");

  if (!source)
    return {
      title: "Static Docs",
    };

  const frontmatter = getFrontmatter<Frontmatter>(source).frontmatter;

  return {
    title: frontmatter.title ?? "Static Docs",
  };
}

/**
 * For demonstration purpose, the both "evaluate" and "MDXRemote" to be rendered
 *
 * implements the second way of getting the Table of Contents (TOC)
 */
export default async function Page() {
  const file = "test-toc.mdx";
  const format = getMarkdownExtension(file);
  const source = await getSource(file);

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  // get the table of content (toc) in a different way instead of vfileDataIntoScope: ["toc"]
  const toc: TocItem[] = [];

  const options: EvaluateOptions = {
    disableImports: true,
    parseFrontmatter: true,
    // we aded the "toc" inside the "scope" ourselves
    scope: { toc, readingTime, props: { foo: "{props.foo} is working." } },
    mdxOptions: {
      remarkPlugins: getRemarkPlugins(toc), // the "remark-flexible-toc" plugin mutates the "toc"
      rehypePlugins,
      recmaPlugins,
      remarkRehypeOptions: getRemarkRehypeOptions(format),
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
