import { Suspense } from "react";
import { type Metadata } from "next";
import { getFrontmatter } from "next-mdx-remote-client/utils";
import {
  evaluate,
  MDXRemote,
  type EvaluateOptions,
} from "next-mdx-remote-client/rsc";

import { recmaPlugins, rehypePlugins, remarkPlugins } from "@/utils/mdx";
import { getSource } from "@/utils/file";
import { getRandomInteger } from "@/utils";
import type { Frontmatter } from "@/types";
import { mdxComponents as components } from "@/mdxComponents";

export async function generateMetadata(): Promise<Metadata> {
  const source = await getSource("test-basic.mdx");

  const frontmatter = getFrontmatter<Frontmatter>(source).frontmatter;

  return {
    title: frontmatter.title,
  };
}

/**
 * renders for both "evaluate" and "MDXRemote"
 */
export default async function Page() {
  const source = await getSource("test-basic.mdx");

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: EvaluateOptions = {
    disableExports: true,
    parseFrontmatter: true,
    scope: { readingTime, props: { foo: "{props.foo} is working." } },
    mdxOptions: {
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
      development: process.env.NODE_ENV === "development", // for experimental
    },
  };

  // @ts-ignore
  const { content, mod, frontmatter } = await evaluate<Frontmatter>({
    source,
    components,
    options,
  });

  // "It has been proven that all exports in the mdx document are removed."
  const proofForNoAnyExports =
    Object.keys(mod).length === 0
      ? "all exports removed"
      : "invalidated removed exports";

  return (
    <table className="result">
      <thead>
        <tr>
          <td>
            <mark>
              with using <strong>evaluate</strong>
            </mark>
            <span className="proof-for-exports">
              <strong>{proofForNoAnyExports}</strong>
            </span>
          </td>
          <td>
            <mark>
              with using <strong>MDXRemote</strong>
            </mark>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{content}</td>
          <td>
            <Suspense fallback={<p>Loading the article...</p>}>
              <MDXRemote
                source={source}
                options={options}
                components={components}
              />
            </Suspense>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
