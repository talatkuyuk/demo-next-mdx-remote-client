import { Suspense } from "react";
import type { Metadata } from "next";
import {
  evaluate,
  MDXRemote,
  type EvaluateOptions,
} from "next-mdx-remote-client/rsc";

import { getMarkdownFile, getMarkdownFiles, RE } from "@/utils/file";
import { recmaPlugins, rehypePlugins, remarkPlugins } from "@/utils/mdx";
import { getRandomInteger, replaceLastDotWithDash } from "@/utils";
import type { Frontmatter } from "@/types";
import { mdxComponents as components } from "@/mdxComponents";

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

export default async function Post({ params }: { params: { slug: string } }) {
  const { source, format, frontmatter } =
    (await getMarkdownFile(params.slug)) ?? {};

  if (!source) return <div>There is no document related.</div>;

  const readingTime = `${getRandomInteger(4, 10)} min.`;

  const options: EvaluateOptions = {
    disableExports: frontmatter?.disableExports,
    enableImports: frontmatter?.enableImports,
    parseFrontmatter: true,
    scope: { readingTime, props: { foo: "{props.foo} is working." } },
    vfileDataIntoScope: ["toc"], // the "remark-flexible-toc" plugin produces vfile.data.toc
    mdxOptions: {
      format,
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
      baseUrl: frontmatter?.enableImports ? import.meta.url : undefined,
    },
  };

  // test both "evaluate" and "MDXRemote"

  const { content, mod } = await evaluate<Frontmatter>({
    source,
    options,
    components,
  });

  // "It has been proven that the exports from the mdx are validated."
  const proofForValidatedExports =
    (mod as any)?.factorial?.((mod as any)?.num) === 720
      ? "validated exports"
      : "invalidated exports";

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
              <strong>
                {frontmatter?.disableExports
                  ? proofForNoAnyExports
                  : proofForValidatedExports}
              </strong>
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
