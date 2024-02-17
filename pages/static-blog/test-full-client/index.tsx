"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import { SerializeResult, serialize } from "next-mdx-remote-client/csr";

import {
  getRemarkRehypeOptions,
  recmaPlugins,
  rehypePlugins,
  remarkPlugins,
} from "@/utils/mdx";
import { Frontmatter } from "@/types";
import DemoStateProvider from "@/contexts/DemoStateProvider";
import { getRandomInteger, obtainFrontmatter } from "@/utils";
import TableResult from "@/components/TableResult";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import HydrateWithComponents from "@/components/HydrateWithComponents";
import MDXClientWithComponents from "@/components/MDXClientWithComponents";
import { useSearchParams } from "next/navigation";

type APIResponse = { source: string; format: "md" | "mdx" } | { error: string };

/**
 * This page is created for only experimental purpose, to see any bug in fully client side rendering.
 */
export default function TestPage() {
  // Why the fetching occurs here not in the child component, this is because of the frontmatter
  const [mdxSource, setMdxSource] = useState<
    SerializeResult<Frontmatter> | undefined
  >();

  const [apiResponse, setApiResponse] = useState<APIResponse | undefined>();

  const router = useRouter(); // to get the searchParams after the router is ready
  const searchParams = useSearchParams();

  // const fetcher = (url: string) => fetch(url).then((res) => res.json());
  // const { data, error, isLoading } = useSWR(String(url), fetcher);

  useEffect(() => {
    async function getMdxSource() {
      if (!router.isReady) return;

      if (!searchParams) return;

      const slug = searchParams.get("slug") as string;

      const url = new URL("http://localhost:3000/api/data");
      slug && url.searchParams.append("slug", slug);

      const response = await fetch(url);
      const data: APIResponse = await response.json();

      if ("error" in data) {
        setApiResponse(data);

        return;
      }

      const readingTime = `${getRandomInteger(4, 10)} min.`;

      const frontmatter = obtainFrontmatter(data.source);

      const mdxSource = await serialize<Frontmatter>({
        source: data.source,
        options: {
          disableExports: frontmatter.disableExports,
          disableImports: true,
          parseFrontmatter: true,
          scope: { readingTime, props: { foo: "{props.foo} is working." } },
          vfileDataIntoScope: ["toc"], // the "remark-flexible-toc" plugin produces vfile.data.toc
          mdxOptions: {
            format: data.format,
            remarkPlugins,
            rehypePlugins,
            recmaPlugins,
            remarkRehypeOptions: getRemarkRehypeOptions(data.format),
            development: process.env.NODE_ENV === "development", // for experimental
          },
        },
      });

      setMdxSource(mdxSource);
      setApiResponse(data);
    }

    getMdxSource();
  }, [searchParams, router.isReady]);

  if (!apiResponse)
    return (
      <TableResult leftColumnHeader="hydrate" rightColumnHeader="MDXClient">
        <LoadingComponent />
        <LoadingComponent />
      </TableResult>
    );

  if ("error" in apiResponse)
    return (
      <TableResult leftColumnHeader="hydrate" rightColumnHeader="MDXClient">
        <ErrorComponent error={apiResponse.error} />
        <ErrorComponent error={apiResponse.error} />
      </TableResult>
    );

  if (!mdxSource)
    return (
      <TableResult leftColumnHeader="hydrate" rightColumnHeader="MDXClient">
        <LoadingComponent />
        <LoadingComponent />
      </TableResult>
    );

  return (
    <>
      <Head>
        <title>Full Client Page</title>
      </Head>

      <DemoStateProvider>
        <TableResult leftColumnHeader="hydrate" rightColumnHeader="MDXClient">
          {/* on the left */}
          <HydrateWithComponents
            mdxSource={mdxSource}
            data={{ source: apiResponse.source, format: apiResponse.format }}
          />

          {/* on the right */}
          <MDXClientWithComponents
            mdxSource={mdxSource}
            data={{ source: apiResponse.source, format: apiResponse.format }}
          />
        </TableResult>
      </DemoStateProvider>
    </>
  );
}
