import { Suspense } from "react";
import { type Metadata } from "next";
import { getFrontmatter } from "next-mdx-remote-server/utils";
import {
  evaluate,
  MDXRemote,
  type EvaluateOptions,
} from "next-mdx-remote-server/rsc";

import { recmaPlugins, rehypePlugins, remarkPlugins } from "@/utils/mdx";
import { getSource } from "@/utils/file";
import { getRandomInteger } from "@/utils";
import type { Frontmatter } from "@/types";
import { mdxComponents as components } from "@/mdxComponents";

export async function generateMetadata(): Promise<Metadata> {
  const source = await getSource("test-error.mdx");

  const frontmatter = getFrontmatter<Frontmatter>(source).frontmatter;

  return {
    title: frontmatter.title,
  };
}

/**
 * renders for both "evaluate" and "MDXRemote"
 *
 * implements an error handling algorithm in server side rendering
 */
export default async function Page() {
  const source = await getSource("test-error.mdx");

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: EvaluateOptions = {
    parseFrontmatter: true,
    scope: { readingTime, props: { foo: "{props.foo} is working." } },
    vfileDataIntoScope: ["toc"], // the "remark-flexible-toc" plugin produces vfile.data.toc
    mdxOptions: {
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
      development: process.env.NODE_ENV === "development", // for experimental
    },
  };

  try {
    const { content, mod, frontmatter } = await evaluate<Frontmatter>({
      source,
      components,
      options,
    });

    // "It has been proven that the variables exported from the mdx document are exported completely and correctly."
    const proofForExports =
      (mod as any)?.factorial?.((mod as any)?.num) === 720
        ? "validated exports"
        : "invalidated exports";

    return (
      <table className="result">
        <thead>
          <tr>
            <td>
              <mark>
                with using <strong>evaluate</strong>
              </mark>
              <span className="proof-for-exports">
                <strong>{proofForExports}</strong>
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
  } catch (error) {
    return (
      <table className="result">
        <thead>
          <tr>
            <td>
              <mark>MDX Source</mark>
            </td>
            <td>
              <mark>MDX Compile Error</mark>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <pre>
                <code className="language-mdx">{source}</code>
              </pre>
            </td>
            <td>
              <pre>
                <code style={{ color: "red" }}>{(error as Error).message}</code>
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
