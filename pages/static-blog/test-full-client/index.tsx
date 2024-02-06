import Head from "next/head";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { mdxComponentsWithContext as components } from "@/mdxComponents";
import MDXClientComponent from "./MDXClientComponent";
import { obtainFrontmatter } from "@/utils";

/**
 * This page is created for only experimental purpose, to see any bug in fully client side rendering.
 */
export default function TestPage() {
  const filename = useSearchParams()?.get("file");

  let url = new URL("http://localhost:3000/api/data");

  if (filename) url.searchParams.append("file", filename);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(String(url), fetcher);

  if (error) return <p>Failed to load.</p>;
  if (isLoading) return <p>Loading the article...</p>;

  const frontmatter = obtainFrontmatter(data.file);

  return (
    <>
      <Head>
        <title>{frontmatter.title}</title>
      </Head>
      <MDXClientComponent body={data.file} components={components} />
    </>
  );
}
