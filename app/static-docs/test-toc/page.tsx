import { Suspense } from "react";
import { type Metadata } from "next";
import { getFrontmatter } from "next-mdx-remote-client/utils";
import {
  evaluate,
  MDXRemote,
  type EvaluateOptions,
  MDXRemoteOptions,
} from "next-mdx-remote-client/rsc";

import {
  getRemarkPlugins,
  recmaPlugins,
  rehypePlugins,
  remarkPlugins,
} from "@/utils/mdx";
import { getSource } from "@/utils/file";
import { getRandomInteger } from "@/utils";
import type { Frontmatter } from "@/types";
import { mdxComponents as components } from "@/mdxComponents";
import { type TocItem } from "@/utils/plugin";

export async function generateMetadata(): Promise<Metadata> {
  const source = await getSource("test-toc.mdx");

  const frontmatter = getFrontmatter<Frontmatter>(source).frontmatter;

  return {
    title: frontmatter.title,
  };
}

/**
 * renders for both "evaluate" and "MDXRemote"
 *
 * implements two ways of getting the Table of Contents (TOC)
 */
export default async function Page() {
  const source = await getSource("test-toc.mdx");

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  // get the table of content (toc) in a different way instead of vfileDataIntoScope: ["toc"]
  const toc: TocItem[] = [];

  const evaluateOptions: EvaluateOptions = {
    parseFrontmatter: true,
    // here, we insert the "toc" inside the "scope" ourselves
    scope: { readingTime, props: { foo: "{props.foo} is working." }, toc },
    mdxOptions: {
      remarkPlugins: getRemarkPlugins(toc), // the "remark-flexible-toc" plugin mutates the "toc"
      rehypePlugins,
      recmaPlugins,
    },
  };

  // @ts-ignore
  const { content, mod, frontmatter } = await evaluate<Frontmatter>({
    source,
    components,
    options: evaluateOptions,
  });

  // now, another simple way to get the table of content
  const mdxRemoteOptions: MDXRemoteOptions = {
    parseFrontmatter: true,
    scope: { readingTime, props: { foo: "{props.foo} is working." } },
    vfileDataIntoScope: ["toc"], // the "remark-flexible-toc" plugin produces vfile.data.toc
    mdxOptions: {
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
    },
  };

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
                options={mdxRemoteOptions}
                components={components}
              />
            </Suspense>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
