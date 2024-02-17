import { Suspense } from "react";
import { type Metadata } from "next";
import { getFrontmatter } from "next-mdx-remote-client/utils";
import { type EvaluateOptions } from "next-mdx-remote-client/rsc";

import {
  remarkPlugins,
  rehypePlugins,
  recmaPlugins,
  getRemarkRehypeOptions,
} from "@/utils/mdx";
import type { Frontmatter } from "@/types";
import { getSource } from "@/utils/file";
import { getMarkdownExtension, getRandomInteger } from "@/utils";
import TableResult from "@/components/TableResult";
import EvaluateComponent from "@/components/EvaluateComponent";
import MDXRemoteComponent from "@/components/MDXRemoteComponent";
import LoadingComponent from "@/components/LoadingComponent";

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
 */
export default async function Page() {
  const file = "test-error-compile.mdx"; // includes mdx syntax error
  const format = getMarkdownExtension(file);
  const source = await getSource(file);

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: EvaluateOptions = {
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
